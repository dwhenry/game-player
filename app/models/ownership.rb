class Ownership
  def initialize(game_id, ttl = 20_000)
    @game_id = game_id
    @ttl = ttl
    @redis = Redis.new
  end

  def list
    keys = redis.keys("#{game_id}:*")
    values = redis.mget *keys
    Hash[keys.zip(values)]
  end

  def take(object_id, owner_id)
    case object_id
    when /\Acard:/
      redis.set(key(object_id), owner_id, nx: true, px: ttl)
    when /\Alocation:/
      location_queue_id = SecureRandom.uuid
      # this is to ensure ttl in the location queue
      redis.set(key(location_queue_id), key(object_id), nx: true, px: ttl)
      redis.rpush(key(object_id), "#{owner_id}:#{location_queue_id}")
    else
      raise "Invalid ID: '#{object_id}'"
    end

  end

  def extend(object_id, owner_id)
    k = key(object_id)

    redis.watch(key(object_id)) do
      if redis.get(k) == owner_id
        redis.set(k, owner_id, xx: true, px: ttl)
      end
      redis.unwatch
    end
  end

  private

  attr_reader :game_id, :ttl, :redis

  def key(object_id)
    "#{game_id}:#{object_id}"
  end
end
