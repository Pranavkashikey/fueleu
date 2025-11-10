## Agents Used
- Github Copilot (VSCode)
- ChatGPT web interface
- Claude Code (web)
- Cursor Agent (tasks.md tasks)

## Prompts & Outputs
- Prompt: "Generate TypeScript interface for banking request"
  Output:

    export interface BankingRequest {
      shipId: string;
      year: number;
      amount: number;
    }
    
- Correction: Added "amount"  validation manually after Copilot missed error handling.

## Validation / Corrections
- Ran tests after every major Copilot completion.
- Manually checked logic against seed data and FuelEU rules.

## Observations
- Copilot saved time for repetitive code.
- Cursor Agent useful for summarizing code tasks.

## Best Practices Followed
- Never pasted agent output blindly; always reviewed and tested.
- Used AGENT_WORKFLOW.md to keep track of agent suggestions for team visibility.
- Mixed and matched agents for best results.

