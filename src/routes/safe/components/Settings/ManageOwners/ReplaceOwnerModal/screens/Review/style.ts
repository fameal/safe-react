import { background, border, lg, secondaryText, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  root: {
    height: '372px',
  },
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
    lineHeight: 'normal',
  },
  manage: {
    fontSize: lg,
  },
  address: {
    marginRight: sm,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  info: {
    backgroundColor: background,
    padding: sm,
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  owners: {
    overflow: 'auto',
    height: '100%',
  },
  ownersTitle: {
    padding: lg,
  },
  owner: {
    padding: sm,
    alignItems: 'center',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  selectedOwnerRemoved: {
    padding: sm,
    alignItems: 'center',
    backgroundColor: '#ffe6ea',
  },
  selectedOwnerAdded: {
    padding: sm,
    alignItems: 'center',
    backgroundColor: '#f7f5f5',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  gasCostsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    backgroundColor: background,
  },
})
