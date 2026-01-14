#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN environment variable is required');
}

const server = new McpServer({
  name: "github-server",
  version: "0.1.0"
});

// Helper function for API calls
async function githubApiCall(url: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${url}`, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${error}`);
  }
  return response.json();
}

// Define schemas
const getUserReposSchema = z.object({
  username: z.string().describe("GitHub username"),
  type: z.enum(['all', 'owner', 'member']).optional().describe("Type of repositories")
});

const createIssueSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  title: z.string().describe("Issue title"),
  body: z.string().optional().describe("Issue body")
});

const getRepoIssuesSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  state: z.enum(['open', 'closed', 'all']).optional().describe("Issue state")
});

// Tool to get user repositories
server.tool(
  "get_user_repos",
  getUserReposSchema.shape,
  async (params: z.infer<typeof getUserReposSchema>) => {
    const { username, type = 'all' } = params;
    try {
      const data = await githubApiCall(`/users/${username}/repos?type=${type}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: error.message
          }
        ],
        isError: true
      };
    }
  }
);

// Tool to create an issue
server.tool(
  "create_issue",
  createIssueSchema.shape,
  async (params: z.infer<typeof createIssueSchema>) => {
    const { owner, repo, title, body } = params;
    try {
      const data = await githubApiCall(`/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({ title, body })
      });
      return {
        content: [
          {
            type: "text",
            text: `Issue created: ${data.html_url}`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: error.message
          }
        ],
        isError: true
      };
    }
  }
);

// Tool to get repository issues
server.tool(
  "get_repo_issues",
  getRepoIssuesSchema.shape,
  async (params: z.infer<typeof getRepoIssuesSchema>) => {
    const { owner, repo, state = 'open' } = params;
    try {
      const data = await githubApiCall(`/repos/${owner}/${repo}/issues?state=${state}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: error.message
          }
        ],
        isError: true
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('GitHub MCP server running on stdio');