// @mui
import { useTheme } from '@mui/material/styles';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
// hooks
import { useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import AddCourse from '../Course/Add';
import ModalLayout from '../../components/ModalLayout';
import AppAreaAllRegistered from '../../sections/@dashboard/general/app/AppAreaAllRegistered';
// sections

// ----------------------------------------------------------------------

export default function GeneralAppAdmin() {
  const { user } = useAuth();
  // const theme = useTheme();
  const { themeStretch } = useSettings();

  const ModalSectionFormRef = useRef();
  const handleToggleNewCourseModal = () => ModalSectionFormRef.current.show((p) => !p);

  const topSectionData = [
    {
      label: 'ثبت نام های امروز',
    },
    {
      label: 'تکمیل مدارک های امروز',
    },
    {
      label: 'گزارش گیری',
    },
    {
      label: 'ساخت دوره ثبت نامی',
      onClick: handleToggleNewCourseModal,
    },
  ];

  return (
    <Page title="General: App">
      <ModalLayout ref={ModalSectionFormRef}>
        <AddCourse />
      </ModalLayout>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid mt={2} container spacing={4}>
          {topSectionData?.map((x) => {
            return (
              <Grid item xs={12} md={3}>
                <Box
                  onClick={x.onClick}
                  sx={{
                    bgcolor: 'grey.700',
                    color: 'common.white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography>{x.label}</Typography>
                </Box>
              </Grid>
            );
          })}

          <Grid item xs={12}>
            <AppAreaAllRegistered />
          </Grid>
        </Grid>

        {/* <Box></Box> */}
      </Container>
      {/* {'welcome'} */}
      {/* <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Active Users"
              percent={2.6}
              total={18765}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Installed"
              percent={0.2}
              total={4876}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Downloads"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid>
        </Grid>
      </Container> */}
    </Page>
  );
}
