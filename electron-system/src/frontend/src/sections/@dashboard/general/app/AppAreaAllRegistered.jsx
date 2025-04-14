import merge from 'lodash/merge';
import { useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField, Grid, Typography } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';
import { separateNumberWithComma } from '../../../../utils/index';
// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 'اردیبهشت ۱۴۰۳',
    data: [
      { name: 'ثبت نام های موفق', data: [10, 34, 13, 56, 77, 88, 99, 60, 50] },
      { name: 'ثبت نام های ناموفق', data: [10, 20, 11, 30, 100, 90, 99, 77, 45] },
      { name: 'بازدیدهای روز', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
    ],
  },
  {
    year: 'اردیبهشت ۱۴۰۳',
    data: [
      { name: '', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
      // { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
    ],
  },
];

export default function AppAreaAllRegistered() {
  const [seriesData, setSeriesData] = useState(0);
  const [selectIndex, setSelectIndex] = useState(0);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
    },
  });

  return (
    <Card>
      <CardHeader
        title={
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <Box>{'نمای کلی'}</Box>

            <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.31097 23.1729C6.19964 22.8659 4.26194 21.8309 2.83285 20.2467C-0.55452 16.4845 -0.250522 10.6821 3.51165 7.29475L8.96388 2.38565C12.7259 -1.00187 18.5283 -0.69773 21.9158 3.06444C25.3033 6.82661 25.0098 12.6191 21.248 16.0066L18.5219 18.4612C18.3041 18.6545 18.0189 18.7543 17.7281 18.7391C17.4373 18.7238 17.1641 18.5948 16.9677 18.3797C16.7744 18.1619 16.6745 17.8767 16.6898 17.5859C16.705 17.2951 16.8341 17.0219 17.0492 16.8255L19.7752 14.3707C22.6322 11.7983 22.8634 7.38434 20.2909 4.52733C17.7184 1.67032 13.3045 1.43895 10.4475 4.01167L4.99522 8.92078C2.13826 11.4933 1.90687 15.9074 4.47955 18.7644C5.56514 19.9638 7.03324 20.7495 8.6334 20.9874C8.92232 21.0321 9.18199 21.1887 9.35634 21.4234C9.53068 21.6581 9.60568 21.952 9.56506 22.2415C9.52448 22.5038 9.39146 22.7429 9.19002 22.9158C8.98857 23.0886 8.73197 23.1837 8.46656 23.1839C8.41451 23.1838 8.36251 23.1801 8.31097 23.1729Z"
                fill="#6E7191"
              />
              <path
                d="M14.0782 23.9428C10.6908 20.1809 10.9948 14.3782 14.7569 10.9909L17.483 8.53633C17.7009 8.343 17.986 8.24315 18.2768 8.2584C18.5676 8.27364 18.8408 8.40273 19.0373 8.61777C19.2306 8.83558 19.3304 9.12072 19.3152 9.41155C19.2999 9.70238 19.1708 9.97553 18.9558 10.1719L16.2297 12.6267C13.3727 15.199 13.1413 19.6131 15.7138 22.4701C18.2863 25.3271 22.7004 25.5585 25.5574 22.986L31.0097 18.0767C33.8666 15.5044 34.0979 11.0903 31.5254 8.23329C30.4399 7.03378 28.9718 6.2481 27.3716 6.0103C27.0827 5.96556 26.823 5.80893 26.6487 5.57426C26.4743 5.33959 26.3993 5.04572 26.4398 4.75618C26.4603 4.61237 26.5091 4.47404 26.5834 4.34919C26.6577 4.22435 26.756 4.11546 26.8726 4.02883C26.9892 3.9422 27.1218 3.87954 27.2628 3.84447C27.4038 3.80941 27.5503 3.80262 27.6939 3.82452C29.8053 4.13155 31.743 5.1666 33.1721 6.75074C36.5485 10.5225 36.2443 16.325 32.4823 19.7125L27.0301 24.6216C25.3483 26.1396 23.1626 26.9787 20.8971 26.976C19.6111 26.9781 18.3392 26.7091 17.1642 26.1864C15.9893 25.6638 14.9377 24.8993 14.0782 23.9428Z"
                fill="#6E7191"
              />
            </svg>
          </Box>
        }
        // subheader="(+43%) than last year"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
        sx={{
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          pb: 2,
        }}
      />
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              my: 2,
              alignItems: 'center',
              height: '80%',
            }}
          >
            <Box
              sx={{
                width: '200px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h2">{separateNumberWithComma('1459')}</Typography>
                <Typography>{'کل ثبت نام های امروز'}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // alignItems: 'center',
                  mt: 4,
                  gap: 1,
                  color: 'grey.700',
                  // p: {
                  //   fontSize: '10px !important',
                  // },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: '15px',
                      height: '15px',
                      bgcolor: 'chart.blue.0',
                      borderRadius: '100%',
                    }}
                  />

                  <Typography>{'بازدیدهای روز'}</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: '15px',
                      height: '15px',
                      bgcolor: 'chart.green.0',
                      borderRadius: '100%',
                    }}
                  />

                  <Typography>{'ثبت نام های موفق'}</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: '15px',
                      height: '15px',
                      bgcolor: 'chart.yellow.0',
                      borderRadius: '100%',
                    }}
                  />

                  <Typography>{'ثبت نام های ناموفق'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            key={CHART_DATA[selectIndex]?.year}
            dir="ltr"
            sx={{
              mt: 3,
              mx: 3,
              '.apx-legend-position-top': {
                display: 'none',
              },
            }}
          >
            <ReactApexChart type="line" series={CHART_DATA[selectIndex]?.data} options={chartOptions} height={364} />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
