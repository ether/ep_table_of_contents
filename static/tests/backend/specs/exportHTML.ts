'use strict';

import {strict as assert} from 'assert';
import * as common from 'ep_etherpad-lite/tests/backend/common';
import {randomString} from 'ep_etherpad-lite/static/js/pad_utils';

let agent:any;
const apiVersion = 1;

const authGet = async (url: string) =>
    agent.get(url).set('authorization', await common.generateJWTToken());

const createPad = async (padId: string) => {
  const res = await authGet(`/api/${apiVersion}/createPad?padID=${padId}`);
  assert.equal(res.body.code, 0, 'Unable to create new pad');
  return padId;
};

const setHTML = async (padId: string, html: string) => {
  const res = await authGet(`/api/${apiVersion}/setHTML?padID=${padId}&html=${encodeURIComponent(html)}`);
  assert.equal(res.body.code, 0, 'Unable to set pad HTML');
  return padId;
};

const getHTMLEndpointFor = (padId: string) => `/api/${apiVersion}/getHTML?padID=${padId}`;

const buildHTML = (body: string) => `<!doctype html><html><body>${body}</body></html>`;

describe('TOC export/import behavior', function () {
  let padId:string;

  before(async function () {
    agent = await common.init();
  });

  beforeEach(async function () {
    padId = randomString(10);
    await createPad(padId);
    await setHTML(padId, buildHTML('<h1>Title</h1><h2>Section A</h2><h2>Section B</h2>'));
  });

  it('keeps the import/export HTML free of TOC sidebar markup', async function () {
    const res = await authGet(getHTMLEndpointFor(padId));
    assert.equal(res.status, 200);

    const html = res.body.data.html;
    assert.match(html, /Title/);
    assert.match(html, /Section A/);
    assert.match(html, /Section B/);
    assert.doesNotMatch(html, /id="toc"/);
    assert.doesNotMatch(html, /id="tocItems"/);
    assert.doesNotMatch(html, /tocItem/);
    assert.doesNotMatch(html, /Table of Contents/);
    assert.doesNotMatch(html, /ep_table_of_contents\/static\/js\/toc\.js/);
  });

  it('does not inject TOC sidebar markup into HTML export', async function () {
    const res = await authGet(`/p/${padId}/export/html`);
    assert.equal(res.status, 200);

    const html = res.text;
    assert.match(html, /Title/);
    assert.match(html, /Section A/);
    assert.match(html, /Section B/);
    assert.doesNotMatch(html, /id="toc"/);
    assert.doesNotMatch(html, /id="tocItems"/);
    assert.doesNotMatch(html, /tocItem/);
    assert.doesNotMatch(html, /Table of Contents/);
    assert.doesNotMatch(html, /ep_table_of_contents\/static\/js\/toc\.js/);
    assert.doesNotMatch(html, /0\.1/);
  });

  it('does not inject TOC sidebar text into plain text export', async function () {
    const res = await authGet(`/p/${padId}/export/txt`);
    assert.equal(res.status, 200);

    const text = res.text;
    assert.match(text, /Title/);
    assert.match(text, /Section A/);
    assert.match(text, /Section B/);
    assert.doesNotMatch(text, /Table of Contents/);
    assert.doesNotMatch(text, /0\.1/);
  });
});
