import { Transmission } from "./";
import test from "ava";

const globalContext: any = { window: { webContents: { send: () => {} } } };

test("Transmission.select should provide valid selection", (t) => {
  const state = { sideBar: { show: false } } as any;
  const tr = new Transmission(state, globalContext);

  t.false(tr.select((state) => state.sideBar.show));
});

test("Transmission should properly work with provided context", async (t) => {
  const state = { sideBar: { show: false } } as any;
  const context = { value: true } as any;
  const tr = new Transmission(state, { ...globalContext, ...context });
  tr.on<{ test: null }>("test", ({ context, draft }) => {
    draft.sideBar.show = (context as any).value;
  });

  await tr.emit<{ test: null }>("test", null);

  t.true(tr.select((state) => state.sideBar.show));
});

test("Transmission should properly apply event changes", async (t) => {
  const state = { sideBar: { show: false } } as any;
  const tr = new Transmission(state, globalContext);
  tr.on<{ test: null }>("test", ({ draft }) => {
    draft.sideBar.show = true;
  });

  await tr.emit<{ test: null }>("test", null);

  t.true(tr.select((state) => state.sideBar.show));
});

test("Transmission should properly handle errors in emit", async (t) => {
  const state = { sideBar: { show: false } } as any;
  const tr = new Transmission(state, globalContext, {});
  tr.on<{ test: null }>("test", () => {
    throw new Error("Test Error");
  });

  await t.throwsAsync(async () => await tr.emit<{ test: null }>("test", null));
});

test("Transmission should properly apply multiple sequential event changes", async (t) => {
  const state = { sideBar: { width: 1 } } as any;
  const tr = new Transmission(state, globalContext);
  tr.on<{ test: null }>("test", ({ draft }) => {
    draft.sideBar.width++;
  });

  await tr.emit<{ test: null }>("test", null);
  await tr.emit<{ test: null }>("test", null);

  t.is(
    tr.select((state) => state.sideBar.width),
    3,
  );
});

test("Transmission should allow emitting events from within event handlers without breaking sequence", async (t) => {
  const state = { sideBar: { width: 1 }, activityBar: { current: "" } } as any;
  const tr = new Transmission(state, globalContext);
  tr.on<{ test: null; test2: null }>("test", ({ draft }) => {
    draft.sideBar.width = draft.sideBar.width === 1 ? draft.sideBar.width + 3 : draft.sideBar.width + 1;
  }).on<{ test: null; test2: null }>("test2", async ({ draft, transmission }) => {
    await transmission.emit<{ test: null; test2: null }>("test", null);
    draft.activityBar.current = String(transmission.select((state) => state.sideBar.width));
  });

  await tr.emit<{ test: null; test2: null }>("test2", null);
  await tr.emit<{ test: null; test2: null }>("test", null);

  t.is(
    tr.select((state) => state.sideBar.width),
    5,
  );
  t.is(
    tr.select((state) => state.activityBar.current),
    "4",
  );
});
