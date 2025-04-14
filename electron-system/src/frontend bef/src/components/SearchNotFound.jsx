import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        چیزی یافت نشد!
      </Typography>
      <Typography variant="body2" align="center">
        برای  &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong> چیزی یافت نشد
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> متن خود را وارد کنید </Typography>
  );
}
