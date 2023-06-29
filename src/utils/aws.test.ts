import { removeBucketNameFromURI } from "./aws";

describe("AWS utils", () => {
  it("removeBucketNameFromURI", () => {
    // Given
    const mockURI =
      "s3://manage-documents.anypay.co.th/anypay-crm/tickets/37c1fcff-62d1-4d9c-930e-c1124f64f11f/images/Screenshot 2566-06-18 at 12.22.54.png";

    // When
    const actual = removeBucketNameFromURI(mockURI);

    // Then
    const expected =
      "/anypay-crm/tickets/37c1fcff-62d1-4d9c-930e-c1124f64f11f/images/Screenshot 2566-06-18 at 12.22.54.png";
    expect(actual).toBe(expected);
  });
});
