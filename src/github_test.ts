import { test, expect, mock } from "bun:test";
import { resolveRef } from "./github";

// Mock API client
const createMockAPI = () => ({
  request: mock((endpoint: string, options: any) => {
    // Mock git refs lookup for tags only
    if (endpoint === "GET /repos/{owner}/{repo}/git/refs/{ref}") {
      if (options.ref === "tags/v1.0.0") {
        return Promise.resolve({
          data: { object: { sha: "tag1234567890abcdef1234567890abcdef123456" } },
        });
      }
      if (options.ref === "tags/release-v2.0.0") {
        return Promise.resolve({
          data: { object: { sha: "rel21234567890abcdef1234567890abcdef123456" } },
        });
      }
      return Promise.reject(new Error("Not found"));
    }
    
    return Promise.reject(new Error("Unexpected endpoint"));
  }),
});

test("resolveRef - tag name", async () => {
  const api = createMockAPI() as any;
  const result = await resolveRef(api, "owner", "repo", "v1.0.0");
  
  expect(result.sha).toBe("tag1234567890abcdef1234567890abcdef123456");
  expect(result.type).toBe("tag");
});

test("resolveRef - full ref tags", async () => {
  const api = createMockAPI() as any;
  const result = await resolveRef(api, "owner", "repo", "refs/tags/release-v2.0.0");
  
  expect(result.sha).toBe("rel21234567890abcdef1234567890abcdef123456");
  expect(result.type).toBe("tag");
});

test("resolveRef - invalid tag", async () => {
  const api = createMockAPI() as any;
  
  expect(async () => {
    await resolveRef(api, "owner", "repo", "nonexistent-tag");
  }).toThrow("Tag not found: nonexistent-tag");
});