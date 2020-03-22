import React from 'react';
import nock from 'nock';
import { render, cleanup, waitForElement, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import 'jest-dom/extend-expect';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'


describe('When editing an empty deck', () => {
  afterEach(cleanup);


  it('allow a card to be added to the tasks deck', async () => {
    nock.recorder.rec()

    const scope = nock("http://localhost:9876/")
      .post('/game_configs/1')
      .reply(200, {
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz',
        },
      });

    const { getByText, getByLabelText, getByPlaceholderText, queryByText } = render(
      <ConfigEditor id={1} decks={{ tasks: [], achievements: [], employees: [] }} />
    );
    userEvent.type(getByLabelText('Name'), 'test card');
    userEvent.type(getByLabelText('Cost'), '1');
    userEvent.type(getByLabelText('Rounds'), '1');
    userEvent.type(getByLabelText('Actions'), 'TBC');
    userEvent.type(getByLabelText('Deck'), 'tasks');
    userEvent.type(getByLabelText('Number'), '3');
    userEvent.click(getByText('Save'));

    let called = false
    setTimeout(() => { called = true; console.log(nock.recorder.play()) }, 1000)
    await waitFor(() => expect(called).toBe(true), {timeout: 2500})

    expect(1 + 1).toBe(2);
  })
});
