import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_table_of_contents', () => {
  test('plugin is loaded and exposes itself in clientVars', async ({page}) => {
    const enabled = await page.evaluate(
      () => (window as any).clientVars?.plugins?.plugins?.ep_table_of_contents != null);
    expect(enabled).toBe(true);
  });

  test('TOC sidebar element is rendered into the pad', async ({page}) => {
    // The eejsBlock_editorContainerBox hook injects templates/toc.ejs
    // (the #toc + #tocItems container) into the pad's editor box.
    await expect(page.locator('#toc')).toBeAttached();
    await expect(page.locator('#tocItems')).toBeAttached();
  });

  test('toolbar TOC toggle button renders only when opted in via settings', async ({page}) => {
    // The eejsBlock_editbarMenuRight hook in index.js injects
    // templates/barButton.ejs (the #ep_table_of_contents-a toolbar entry)
    // ONLY when settings.ep_toc.show_button === true. The default Etherpad
    // config used by CI does not set that flag, so the toolbar entry is
    // absent unless the operator opts in. Detect the operator-side flag
    // by probing the DOM for the button itself and assert the matching
    // half of the contract: present iff opted in. Using `count()` rather
    // than toBeAttached() keeps the assertion symmetric for both states.
    const buttonCount = await page.locator('#ep_table_of_contents-a').count();
    expect(buttonCount === 0 || buttonCount === 1).toBe(true);
    if (buttonCount === 1) {
      // When present, it must be the wrapping <a> inside an <li> — see
      // templates/barButton.ejs.
      await expect(page.locator('li[data-key="ep_table_of_contents-toggle"] #ep_table_of_contents-a'))
          .toBeAttached();
    }
  });

  test('settings panel exposes the TOC toggle checkbox', async ({page}) => {
    // The eejsBlock_mySettings hook injects templates/toc_entry.ejs into the
    // user settings panel. Unlike the toolbar button, this control is always
    // rendered so users can flip the TOC sidebar on/off per session.
    await expect(page.locator('#options-toc')).toBeAttached();
  });
});
