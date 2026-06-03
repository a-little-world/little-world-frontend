import { apiFetch } from './helpers';

/**
 * Persists walkthrough progress (best-effort). Backend reads `self_onboarding_step_id` from the query string.
 */
async function updateSelfOnboardingStep(stepId: string): Promise<void> {
  try {
    const params = new URLSearchParams({ self_onboarding_step_id: stepId });
    await apiFetch(`/api/user/self_onboarding/update/?${params.toString()}`, {
      method: 'POST',
    });
  } catch {
    // UX falls back to URL params + local state.
  }
}

export default updateSelfOnboardingStep;
