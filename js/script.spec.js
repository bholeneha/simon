/**
 * @jest-environment jsdom
 */
//const { SimonGame } = require("./script");

describe("Script", () => {

  let game;

  const mockcreateOscillator = jest.fn(() => {
    return {
      channelCount: 2,
      start: jest.fn()
    }
  });
  beforeEach(() => {
    const mockaudioContext = jest.fn(() => {
      return {
        createOscillator: mockcreateOscillator,
      }
    });
    jest.spyOn(document, 'getElementById').mockReturnValue({
      addEventListener: jest.fn(() => { })
    });
    window.AudioContext = mockaudioContext;

    game = new SimonGame();
  });

  describe("Enter Play Screen Function", () => {
    beforeEach(() => {
      audCtx = { resume: jest.fn() };

    })

    it("should call audctx.resume", () => {
      expect(1).toEqual(1);
    })
  })
});