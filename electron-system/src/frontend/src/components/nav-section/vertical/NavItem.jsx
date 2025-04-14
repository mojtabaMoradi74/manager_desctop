import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
//
import Iconify from '../../Iconify';
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle, ListCircleItemIconStyle } from './style';
import { isExternalLink } from '..';

// ----------------------------------------------------------------------

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  isCollapse: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }) {
  const { title, path, icon, info, children } = item;

  const renderContent = (
    <>
      {icon ? <ListItemIconStyle>{icon}</ListItemIconStyle> : ''}

      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active} isChildren={!!children}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { icon, title, path, info, children } = item;

  const renderContent = (
    <>
      {/* {icon ? <ListItemIconStyle>{icon}</ListItemIconStyle> : <DotIcon active={active} />} */}
      {!children && active ? (
        <ArrowBackIcon
          fontSize="15"
          sx={{
            mr: 1,
          }}
        />
      ) : (
        ''
      )}
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem isChildren={!!children}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

DotIcon.propTypes = {
  active: PropTypes.bool,
};

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            // bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

ArrowIcon.propTypes = {
  open: PropTypes.bool,
};

export function ArrowIcon({ open }) {
  // return open ? (
  //   <ArrowDropUpIcon sx={{ fontSize: '25px', ml: 1 }} />
  // ) : (
  //   <ArrowDropDownIcon sx={{ fontSize: '25px', ml: 1 }} />
  // );
  // forward
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-back-fill'}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  );
}
