import { Box, Button, Grid } from '@mui/material';
import * as React from 'react';
import CustomInput from './CustomInput';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SimpleAreaChart from '../common/SimpleAreaChart';
import { useMediaQuery } from 'react-responsive';
import Erc20 from '../../abi/Erc20.json';
import Nerd from '../../abi/NerdFaucetV2.json';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "@ethersproject/contracts";
import { address } from 'utils/ethers.util';
import { BigNumber } from '@web3-onboard/common/node_modules/ethers';
import { formatEther } from 'ethers/lib/utils';

const OverviewTab = () => {
  const [sellAmount, setSellAmount] = React.useState('0');
  const [buyAmount, setBuyAmount] = React.useState('0');
  const [totalStake, setTotalStake] = React.useState('');
  const [nfv, setNfv] = React.useState('');
  const [gfv, setGfv] = React.useState('');
  const [refRewards, setRefRewards] = React.useState('');
  const [flameBalance, setFlameBalance] = React.useState('');
  const [totalPlayers, setTotalPlayers] = React.useState('');
  const { library, account } = useWeb3React<Web3Provider>();

  React.useEffect(() => {
    async function getNerdData() {
      const nerd = new Contract(address['nerd'], Nerd.abi, library);
      const data = await nerd.getNerdData(account);
      const totalDeposits = await nerd.total_deposits();
      setTotalStake(formatEther(totalDeposits));
      setNfv(formatEther(data[6]));
      setGfv(formatEther(data[3]));
      setRefRewards(formatEther(data[7]));
      const flame = new Contract(address['$flame'], Erc20.abi, library);
      const balance = await flame.balanceOf(account);
      setFlameBalance(formatEther(balance));
      const totalUsers = await nerd.total_users();
      setTotalPlayers(totalUsers.toString());
    }
    getNerdData();
  }, []);

  const deposit = async () => {
    const stakeToken = new Contract(address['$stake'], Erc20.abi, library?.getSigner());
    const balance = await stakeToken.balanceOf(account);
    await stakeToken.approve(address['nerd'], BigNumber.from(balance.toString()));
    stakeToken.once("Approval", () => {
      const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
      nerd.deposit(BigNumber.from(balance.toString()), account);
    });
  }

  const compoundAll = async () => {
    const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
    await nerd.compoundFaucet();
  }

  const claimAll = async () => {
    const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
    await nerd.claim();
  }

  const handleSellAmount = (e: any) => {
    e.target.value = e.target.value.toString().replace(",", ".").replace(" ", "");
    if (isNaN(e.target.value)) {
      return;
    }
    setSellAmount(e.target.value);
  }

  const handleBuyAmount = (e:any) => {
    e.target.value = e.target.value.toString().replace(",", ".").replace(" ", "");
    if (isNaN(e.target.value)) {
      return;
    }
    setBuyAmount(e.target.value);
  }
  const isResp320 = useMediaQuery({
    query: '(max-width: 320px)'
  });
  const isResp520 = useMediaQuery({
    query: '(max-width: 520px)'
  });
  const isResp600 = useMediaQuery({
    query: '(max-width: 600px)'
  });
  const isResp720 = useMediaQuery({
    query: '(max-width: 720px)'
  });
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: isResp520?'20px':'26px',
          fontWeight: 'bold',
          color: 'lightblue'
        }}
      >
        Earn up to 3% daily with Stake Protocol's Net Elastic Rebase Depletion
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          padding: '0px',
          display:isResp520?'initial':'flex'
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              background: isResp600?'#69696969':'#212121',
              padding: '20px',
              borderRadius: '16px'
            }}
          >
            <Box
              sx={{
                fontSize: isResp520?'20px':'28px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              Total Stake Available
            </Box>
            <Box
              sx={{
                fontSize: '26px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              { totalStake }
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              $3,532.23432
            </Box>
            {/* buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                paddingTop: '20px'
              }}
            >
              <Box
                sx={{
                  width: '50%'
                }}
              >
                <Button onClick={claimAll} size="large" color="secondary" 
                  fullWidth variant="contained"
                  sx={{
                    fontSize:isResp520?'0.68rem':'0.9375rem',
                    padding:isResp520?'8px 5px':'8px 22px'
                  }}>
                  Claim all
                </Button>
              </Box>
              <Box
                sx={{
                  width: '50%'
                }}
              >
                <Button onClick={compoundAll} size="large" color="secondary" 
                fullWidth variant="contained"
                sx={{
                  fontSize:isResp520?'0.68rem':'0.9375rem',
                  padding:isResp520?'8px 5px':'8px 22px'
                }}>
                  Compound all
                </Button>
              </Box>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Button onClick={deposit} size="large" color="secondary" fullWidth variant="contained">Deposit</Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              padding: '20px',
              background: isResp600?'#69696969':'#212121',
              borderRadius: '16px'
            }}
          >
            {/* sell */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
              }}
            >
              <Box
                sx={{
                  width:'100%'
                }}>
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box>
                    Sell Stake
                  </Box>
                  <Box sx={{ flexGrow: 1 }}></Box>
                  <Box>Stake Balance: 65,707</Box>
                </Box>
                <CustomInput 
                  value={sellAmount} 
                  setValue={e => handleSellAmount(e)} 
                  width='100%'
                  icon={<SellIcon />} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                  <Button color="secondary" variant="contained">Sell</Button>
                </Box>
              </Box>
            </Box>
            {/* buy */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
              }}
            >
              <Box 
                sx={{
                  width:'100%'
                }}>
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box>
                    Buy Stake
                  </Box>
                  <Box sx={{ flexGrow: 1 }}></Box>
                  <Box>BNB Balance: 1.452</Box>
                </Box>
                <CustomInput 
                  value={buyAmount} 
                  setValue={e => handleBuyAmount(e)} 
                  width='100%'  
                  icon={<ShoppingBagIcon />} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                  <Button color="secondary" variant="contained">Buy</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              background: isResp600?'#69696969':'#212121',
              padding: '20px',
              borderRadius: '16px'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={isResp320?12:isResp600?6:isResp720?12:6} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}
                    sx={{
                      display: 'flex',
                      justifyContent:'center'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'15px':'18px',
                            fontWeight: 'bold'
                          }}>NFV
                          </Grid>  
                          <Grid item xs={12} md={12} 
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'12px':'16px',
                            paddingTop: isResp520?'5px !important':'16px',
                          }}>
                          (Net Faucet Value)
                        </Grid>    
                      </Grid>
                  </Grid>
                  <Grid item xs={12} md={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: isResp520?'400':'bold',
                            paddingTop: isResp520?'12px !important':'16px'
                          }}>
                            { nfv }
                        </Grid>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: '400',
                            paddingTop: '0px !important'
                          }}>
                          $65,707
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={isResp320?12:isResp600?6:isResp720?12:6} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}
                    sx={{
                      display: 'flex',
                      justifyContent:'center'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'15px':'18px',
                            fontWeight: 'bold'
                          }}>GFV
                          </Grid>  
                          <Grid item xs={12} md={12} 
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'12px':'16px',
                            paddingTop: isResp520?'5px !important':'16px',
                          }}>
                          (Gross Faucet Value)
                        </Grid>    
                      </Grid>
                  </Grid>
                  <Grid item xs={12} md={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: isResp520?'400':'bold',
                            paddingTop: isResp520?'12px !important':'16px'
                          }}>
                            { gfv }
                        </Grid>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: '400',
                            paddingTop: '0px !important'
                          }}>
                          $65,707
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={isResp320?12:isResp600?6:isResp720?12:6} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}
                    sx={{
                      display: 'flex',
                      justifyContent:'center'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'15px':'18px',
                            fontWeight: 'bold'
                          }}>Referral Rewards
                          </Grid>     
                      </Grid>
                  </Grid>
                  <Grid item xs={12} md={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: isResp520?'400':'bold',
                            paddingTop: isResp520?'12px !important':'16px'
                          }}>
                            { refRewards }
                        </Grid>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: '400',
                            paddingTop: '0px !important'
                          }}>
                          $65,707
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={isResp320?12:isResp600?6:isResp720?12:6} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}
                    sx={{
                      display: 'flex',
                      justifyContent:'center'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent:'center',
                            fontSize: isResp520?'15px':'18px',
                            fontWeight: 'bold'
                          }}>FLAME in Wallet
                          </Grid>     
                      </Grid>
                  </Grid>
                  <Grid item xs={12} md={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: isResp520?'400':'bold',
                            paddingTop: isResp520?'12px !important':'16px'
                          }}>
                            { flameBalance }
                        </Grid>
                        <Grid item xs={12} md={12}
                          sx={{
                            display: 'flex',
                            justifyContent:'center',
                            fontSize: isResp520?'13px':'16px',
                            fontWeight: '400',
                            paddingTop: '0px !important'
                          }}>
                          $5,707
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              background: isResp600?'#69696969':'#212121',
              padding: '20px',
              borderRadius: '16px'
            }}
          >
            {/* NERD */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: isResp520?'16px':'20px'
              }}
            >
              NERD
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', fontSize: isResp520?'13px':'inintial' }}>
              (Net Elastic Rebase Depletion)
            </Box>
            <Box>

            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              background: isResp600?'#69696969':'#212121',
              padding: '20px',
              borderRadius: '16px'
            }}
          >
            {/* market cap */}
            <Grid container spacing={1}
              sx={{
                fontSize: isResp520?'13px':'initial'
              }}>
              <Grid item xs={isResp720?12:6} md={2}sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Market Cap
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  $999,999,999
                </Box>
              </Grid>
              {/* Total players */}
              <Grid item xs={isResp720?12:6} md={2} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Total Players
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  99,999
                </Box>
              </Grid>
              {/* faucet returns */}
              <Grid item xs={isResp720?12:6} md={2} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Faucet Returns
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  1% Daily
                </Box>
                <Box
                  sx={{
                    display: isResp520?'none':'flex',
                    justifyContent: 'center',
                  }}
                >
                  (on locked value)
                </Box>
              </Grid>
              {/* Treasury Value */}
              <Grid item xs={isResp720?12:6} md={3} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Treasury Value
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  $999,999,999
                </Box>
              </Grid>
              {/* Total POL */}
              <Grid item xs={isResp720?12:6} md={3} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Total POL
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  $999,999,999
                </Box>
              </Grid>
              {/* total supply */}
              <Grid item xs={isResp720?12:6} md={2} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Total Supply
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  1,865,707
                </Box>
              </Grid>
              {/* Locked in Vault */}
              <Grid item xs={isResp720?12:6} md={2} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Locked in Vault
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  65,707
                </Box>
              </Grid>
              {/* rebase returns */}
              <Grid item xs={isResp720?12:6} md={2} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Rebase Returns
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  2% Daily
                </Box>
                <Box
                  sx={{
                    display: isResp520?'none':'flex',
                    justifyContent: 'center',
                  }}
                >
                  (on locked value)
                </Box>
              </Grid>
              {/* floor price */}
              <Grid item xs={isResp720?12:6} md={3} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Floor Price
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  65,707
                </Box>
              </Grid>
              {/* time until next rebase */}
              <Grid item xs={isResp720?12:6} md={3} sx={{ display: isResp520?'flex':'block' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'flex-start':'center',
                    fontWeight: isResp520?'400':'bold',
                    flex: isResp520?'0 0 60%':'auto',
                    maxWidth: isResp520?'60%':'initial'
                  }}
                >
                  Time until next rebase
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isResp520?'end':'center',
                    flex: isResp520?'0 0 40%':'auto',
                    maxWidth: isResp520?'40%':'initial'
                  }}
                >
                  23 min
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            paddingLeft:isResp520?'0px !important':'auto'
          }}
        >
          <Box
            sx={{
              background: isResp600?'#69696969':'#212121',
              padding: '20px',
              borderRadius: '16px'
            }}
          >
            {/* <SimpleAreaChart /> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OverviewTab;