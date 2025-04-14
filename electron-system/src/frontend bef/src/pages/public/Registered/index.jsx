
import { Box, Container, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import useSettings from '../../../hooks/useSettings';

const Registered=()=>{

  const { themeStretch } = useSettings();


    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <Box sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Box sx={{
                        display:"flex",
                        alignItems:"center",
                        border:"1px solid #ccc",
                        borderRadius:1
                }}>
                        <Box sx={{
                            "svg":{
                                width:"90px",
                                height:"90px",
                                color:"success.main"
                            }
                        }}>
                            <CheckCircle />
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection:"column",
                            p:3,
                        }}>
                        <Typography 
                            variant='h4'
                            sx={{
                                color:"success.main"
                            }}
                        >
                        {"ثبت نام شما با موفقیت انجام شد"}
                        </Typography>

                        <Typography variant='h6'>
                        {" منتظر قرعه کشی باشید"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    )

}

export default Registered;