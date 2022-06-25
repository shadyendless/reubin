import { SDKError } from "../src";

describe("Errors", () => {
  it("error contains message", () => {
    const error = new SDKError("Service unavailable", 503);
    expect(error).toBeInstanceOf(SDKError);
    expect(error.name).toBe("SDKError");
  });
});
