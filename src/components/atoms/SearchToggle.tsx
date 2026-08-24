import { Switch } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import useSearchState from '../../hooks/useSearchState';

export interface SearchToggleProps {
  className?: string;
}

function SearchToggle({ className }: SearchToggleProps) {
  const { t } = useTranslation();
  const { isSearching, pending, error, ready, setSearching } = useSearchState();
  const errorMessage = error
    ? error.message || t('match_overview.search_toggle.error')
    : undefined;

  return (
    <Switch
      className={className}
      label={t('match_overview.search_toggle.label')}
      description={t(
        isSearching
          ? 'match_overview.search_toggle.on'
          : 'match_overview.search_toggle.off',
      )}
      labelInline
      fullWidth
      cannotError={!errorMessage}
      error={errorMessage}
      checked={isSearching}
      disabled={pending || !ready}
      onCheckedChange={next => setSearching(next)}
    />
  );
}

export default SearchToggle;
