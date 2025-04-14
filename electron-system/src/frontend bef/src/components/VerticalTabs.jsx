import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {Badge} from '@mui/material'

function TabPanel(props) {
  const {children, value, index, ...other} = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function VerticalTabs({data}) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{bgcolor: 'background.paper', display: 'flex', maxWidth: '100%', width: '100%'}}>
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          maxWidth: 'auto',
          minWidth: '180px',
          '.css-1qz9yuy-MuiButtonBase-root-MuiTab-root': {
            marginRight: '0 !important',
            minWidth: '180px',
            justifyContent: 'flex-start',
            pl: '10px',
          },
        }}
        // className='w-[300px]'
      >
        {data?.map((x, i) => {
          return (
            <Tab
              label={
                <div className='flex gap-3'>
                  <span>{x.label}</span>
                  {x?.badge ? <Badge badgeContent={x?.badge?.label} color='error' /> : ''}
                </div>
              }
              icon={x.icon}
              {...a11yProps(i)}
            />
          )
        })}
      </Tabs>
      {data?.map((x, i) => {
        return (
          <TabPanel className='w-[calc(100%-180px)]' value={value} index={i}>
            <x.component />
          </TabPanel>
        )
      })}
    </Box>
  )
}
