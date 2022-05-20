import { Box, Button, Grid } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import * as React from 'react';
import CustomInput from './CustomInput';
import { useMediaQuery } from 'react-responsive';
import { address } from '../../utils/ethers.util';
import { getAccount } from 'utils/account.utils';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { BigNumber } from '@web3-onboard/common/node_modules/ethers';
import Erc20 from '../../abi/Erc20.json';
import Nerd from '../../abi/NerdFaucetV2.json';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "@ethersproject/contracts";


const FaucetTab = () => {
  const [sellAmount, setSellAmount] = React.useState('0');
  const [buyAmount, setBuyAmount] = React.useState('0');
  const [nfv, setNfv] = React.useState('0');
  const [deposits, setDeposits] = React.useState('0');
  const [grossClaimed, setGrossClaimed] = React.useState('0');
  const [maxPayout, setMaxPayout] = React.useState('0');
  const { library } = useWeb3React<Web3Provider>();

  React.useEffect(() => {
    async function getNerdData() {
      const nerd = new Contract(address['nerd'], Nerd.abi, library);
      const userAddress = getAccount().address;
      const data = await nerd.getNerdData(userAddress);
      setNfv(formatEther(data[6]));
      setDeposits(formatEther(data[5]));
      setGrossClaimed(formatEther(data[3]));
      setMaxPayout(formatEther(data[0]));
    }
    getNerdData();
  }, []);

  const deposit = async () => {
    const userAddress = getAccount().address;
    const stakeToken = new Contract(address['$stake'], Erc20.abi, library?.getSigner());
    const balance = await stakeToken.balanceOf(userAddress);
    await stakeToken.approve(address['nerd'], BigNumber.from(balance.toString()));
    stakeToken.once("Approval", () => {
      const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
      nerd.deposit(BigNumber.from(balance.toString()), userAddress);
    });
  }

  const claim = async() => {
    const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
    await nerd.claim();
  }

  const compoundFaucet = async () => {
    const nerd = new Contract(address['nerd'], Nerd.abi, library?.getSigner());
    await nerd.compoundFaucet();
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
  const isResp300 = useMediaQuery({
    query: '(max-width: 300px)'
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
    <Grid container spacing={2}
      sx={{
        display: isResp520?'block':'flex'
      }}
    >
      {/* net faucet value */}
      <Grid item xs={12}>
        <Box
          sx={{
            background: isResp600?'#69696969':'#212121',
            padding: '20px',
            borderRadius: '16px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              marginBottom: '30px'
            }}
          >
            Net Faucet Value (NFV)
          </Box>
          <Grid container spacing={3}>
            {/* nfv available */}
            <Grid sx={{ display: 'flex', justifyContent: 'center' }} item 
            xs={isResp300?12:isResp600?6:isResp720?12:6} md={3}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isResp520?'14px':'18px',
                    marginBottom: '10px'
                  }}
                >
                  NFV Available
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  {nfv}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  $3,532.23432
                </Box>
              </Box>
            </Grid>
            {/* deposits */}
            <Grid sx={{ display: 'flex', justifyContent: 'center' }} item 
            xs={isResp300?12:isResp600?6:isResp720?12:6} md={3}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isResp520?'14px':'18px',
                    marginBottom: '10px'
                  }}
                >
                  Deposits
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  { deposits }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  $3,532.23432
                </Box>
              </Box>
            </Grid>
            {/* Gross Claimed */}
            <Grid sx={{ display: 'flex', justifyContent: 'center' }} 
            item xs={isResp300?12:isResp600?6:isResp720?12:6} md={3}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isResp520?'14px':'18px',
                    marginBottom: '10px'
                  }}
                >
                  Gross Claimed
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  { grossClaimed }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  $3,532.23432
                </Box>
              </Box>
            </Grid>
            {/* max payout */}
            <Grid sx={{ display: 'flex', justifyContent: 'center' }} item 
            xs={isResp300?12:isResp600?6:isResp720?12:6} md={3}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: isResp520?'14px':'18px',
                    marginBottom: '10px'
                  }}
                >
                  Max Payout
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  { maxPayout }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center',fontSize: isResp520?'13px':'initial', }}>
                  $3,532.23432
                </Box>
              </Box>
            </Grid>
            {/* buttons */}
            
            <Grid item xs={isResp600?6:4}>
              <Button onClick={claim} color="secondary" fullWidth variant="contained"
                sx={{ fontSize:isResp520?'0.68rem':isResp600?'0.875rem':isResp720?'0.62rem':'0.875rem'}}>
                Claim
              </Button>
            </Grid>
            {
              !isResp600 &&
              <Grid item xs={4}>
                <Button onClick={compoundFaucet} color="secondary" fullWidth variant="contained"
                  sx={{ fontSize:isResp520?'0.58rem':isResp600?'0.875rem':isResp720?'0.62rem':'0.875rem'}}>
                    Compound
                  </Button>
              </Grid>
            }
            <Grid item xs={isResp600?6:4}>
              <Button onClick={deposit} color="secondary" fullWidth variant="contained"
                sx={{ fontSize:isResp520?'0.68rem':isResp600?'0.875rem':isResp720?'0.62rem':'0.875rem'}}>
                Deposit
              </Button>
            </Grid>
            {
              isResp600 &&
              <Grid item xs={12}>
                <Button color="secondary" fullWidth variant="contained"
                  sx={{ fontSize:isResp520?'0.68rem':isResp600?'0.875rem':isResp720?'0.62rem':'0.875rem'}}>
                    Compound
                  </Button>
              </Grid>
            }
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            background: isResp600?'#69696969':'#212121',
            padding: '20px',
            borderRadius: '16px'
          }}
        >
          {/* sell */}
          <Box
            sx={{
              display: 'block',
              justifyContent: 'center',
            }}
          >
            <Box>
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
              <CustomInput value={sellAmount} setValue={e=>handleSellAmount(e)} width="100%" icon={<SellIcon />} />
              <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                <Button color="secondary" variant="contained">Sell</Button>
              </Box>
            </Box>
          </Box>
          {/* buy */}
          <Box
            sx={{
              display: 'block',
              justifyContent: 'center',
            }}
          >
            <Box>
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
              <CustomInput value={buyAmount} setValue={e=>handleBuyAmount(e)} width="100%" icon={<ShoppingBagIcon />} />
              <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                <Button color="secondary" variant="contained">Buy</Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            background: isResp600?'#69696969':'#212121',
            padding: '20px',
            borderRadius: '16px'
          }}
        >
          some description
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            background: isResp600?'#69696969':'#212121',
            padding: '20px',
            borderRadius: '16px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            NERD
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            (Net Elastic Rebase Depletion)
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{fontSize:isResp520?'13px':'initial'}}>
              <Grid container spacing={2} sx={{paddingTop:isResp520?'15px':'auto'}}>
                <Grid item xs={8} md={6}>
                  Net Deposits
                </Grid>
                <Grid item xs={4} md={6}>
                  -123.3211
                </Grid>
                <Grid item xs={8} md={6}>
                  <Box>
                    Current Rebase Rate
                  </Box>
                  <Box
                    sx={{ paddingLeft: isResp520?'0px':'50px' }}
                  >
                    (daily)
                  </Box>
                </Grid>
                <Grid item xs={4} md={6}>
                  0.2%
                </Grid>
                <Grid item xs={8} md={6}>
                  GFV Depletion
                </Grid>
                <Grid item xs={4} md={6}>
                  no
                </Grid>
                <Grid item xs={8} md={6}>
                  Depletion Amount
                </Grid>
                <Grid item xs={4} md={6}>
                  0 Stake
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default FaucetTab;