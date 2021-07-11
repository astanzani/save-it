import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  themePreview: {
    width: 204,
    height: 150,
    display: 'flex',
  },
  themePreviewNav: {
    width: '35%',
  },
  themePreviewMain: {
    width: '65%',
  },
  themePreviewAvatar: {
    marginRight: 8,
  },
  themePreviewName: {},
  themePreviewNavRow: {
    marginLeft: theme.spacing(1),
  },
  themePreviewMainTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  themeAdd: {
    background: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  themePreviewItemTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  themePreviewItemDesc: {
    marginLeft: theme.spacing(1),
    marginTop: 2,
  },
  selected: {
    borderColor: theme.palette.primary.main,
  },
  formControl: {
    padding: theme.spacing(2),
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radio: {
    border: `4px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginRight: theme.spacing(2),
    display: 'flex',
  },
  radioSelected: {
    borderColor: theme.palette.primary.main,
  },
  label: {
    cursor: 'pointer',
  },
  inputWrapper: {
    borderTop: `4px solid ${theme.palette.divider}`,
  },
  inputWrapperSelected: {
    borderTop: `4px solid ${theme.palette.primary.main}`,
  },
  themeName: {
    textTransform: 'capitalize',
  },
}));
