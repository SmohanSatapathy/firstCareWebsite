import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import UserHeader from "./UserHeader";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
export default function Bill() {
  let userInfo;
  let componentRef = useRef();
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join(".");
  }
  useEffect(() => {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) navigate("/");
  });

  async function handleprint() {
    if (pname === null || invdate === null) {
      setOpenError1(true);
      return;
    }
    setLoading(true);
    const newInvoiceDate = convert(invdate.$d);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const billData = await axios.post(
        "/bill/create",
        {
          userId: userInfo._id,
          invoiceNo: invnum,
          name: username,
          invoiceDate: newInvoiceDate,
          phoneNo: phnnum,
          products: data,
          total,
          location: backendLocation,
        },
        config
      );

      if (billData) {
        setMessage(billData.data.message);
        setOpenSuccess(true);
      }
      setLoading(false);
      setShowInv(true);
    } catch (e) {
      console.log(e);
      setMessage(e.message);
      setOpenError(true);
      setLoading(false);
    }
  }

  const fetchStockNames = async () => {
    setLoading(true);
    setStockNames(() => []);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const names = await axios.get("/stock/get", config);
      const stocksName = names.data.stockList;
      console.log(stocksName);
      const nameList = stocksName.map((stock) => stock.productName);
      const rateList = stocksName.map((stock) => stock.rate);
      setStockNames(nameList);
      setStockRates(rateList);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockNames();
  }, []);

  function handleSubmit() {
    setData([...data, { pname, quantity, rate, amount: rate * quantity }]);
    setAmount(amount + rate * quantity);
    setPname("");
    setQuantity("");
    setRate("");
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
    setOpenError(false);
    setOpenError1(false);
  };

  function back() {
    setShowInv(false);
    setDiscount(null);
    setInvdate(null);
    setLocation("");
    setPhnnum("");
    setUsername("");
    setInvnum("");
    setAmount(0);
    setData([]);
  }

  const [data, setData] = useState([]);
  const [pname, setPname] = useState(null);
  const [showInv, setShowInv] = useState(false);
  const [username, setUsername] = useState("");
  const [invnum, setInvnum] = useState("");
  const [invdate, setInvdate] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [phnnum, setPhnnum] = useState("");
  const [location, setLocation] = useState("");
  const [backendLocation, setBackendLocation] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openError1, setOpenError1] = useState(false);
  const [message, setMessage] = useState("");
  const [stockNames, setStockNames] = useState([]);
  const [stockRates, setStockRates] = useState([]);
  const navigate = useNavigate();
  let total = amount - amount * (discount / 100);
  const address1 =
    "At/Po-Adakata,Via-Madhyakhanda,P.s-Gania,Dist-Nayagarh,Pin-752093";
  const address2 = "At-Sorada,Po-Subalaya,P.s-Nuagaon,Dist-Nayagarh,Pin-752091";
  return (
    <>
      {showInv ? (
        <Box sx={{ padding: "15px" }}>
          <Stack direction="row" gap="15px">
            <ReactToPrint
              trigger={() => <Button variant="contained">Print</Button>}
              content={() => componentRef}
            />
            <Button onClick={() => back()} variant="contained">
              Back
            </Button>
          </Stack>
          <Stack
            sx={{ color: "black", padding: "50px" }}
            gap="20px"
            ref={(el) => (componentRef = el)}
          >
            <Stack direction="row" justifyContent="space-between">
              <Stack>
                <Typography variant="h4" sx={{ fontWeight: "700" }}>
                  First Care Medical Store
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  {location}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  Phone Number:{location === address1 ? 7008554435 : 999999999}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  GST: D.L.No.:{" "}
                  {location === address1
                    ? "NA-40631R NA-4063RC 17331RX"
                    : "NANANANANANANANNANA"}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  Name:{username}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  Phone Number:{phnnum}
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  Invoice Number:{invnum}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  Invoice Date:{invdate.$D}-{invdate.$M + 1}-{invdate.$y}
                </Typography>
              </Stack>
            </Stack>
            <Stack padding="50px">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((n) => {
                      return (
                        <TableRow key={n.pname}>
                          <TableCell>{n.pname}</TableCell>
                          <TableCell>{n.quantity}</TableCell>
                          <TableCell>{n.rate}</TableCell>
                          <TableCell>{n.quantity * n.rate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan="3"
                        align="right"
                        sx={{ fontWeight: "700" }}
                      >
                        Sub-Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: "700" }}>{amount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan="3"
                        align="right"
                        sx={{ fontWeight: "700" }}
                      >
                        Total Discount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "700" }}>
                        {(amount * discount) / 100}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan="3"
                        align="right"
                        sx={{ fontWeight: "700" }}
                      >
                        Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: "700" }}>{total}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack>
          <UserHeader />
          <Stack gap="25px" sx={{ padding: "40px" }}>
            <Typography variant="h3">Billing Page</Typography>
            <Stack
              sx={{ flexDirection: { xs: "column", sm: "row" } }}
              gap="20px"
            >
              <TextField
                label="Invoice Number"
                name="invoice_num"
                value={invnum}
                onChange={(e) => setInvnum(e.target.value)}
              />
              <TextField
                label="Name"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Invoice Date"
                  value={invdate}
                  onChange={(neWValue) => setInvdate(neWValue)}
                />
              </LocalizationProvider>
              <TextField
                label="Phone Number"
                name="phone_number"
                value={phnnum}
                onChange={(e) => setPhnnum(e.target.value)}
              />
              <FormControl sx={{ width: 400 }}>
                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={location}
                  label="Location"
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <MenuItem
                    value={
                      "At/Po-Adakata,Via-Madhyakhanda,P.s-Gania,Dist-Nayagarh,Pin-752093"
                    }
                    onClick={() => {
                      setBackendLocation("Adakata");
                    }}
                  >
                    Adakata
                  </MenuItem>
                  <MenuItem
                    value={
                      "At-Sorada,Po-Subalaya,P.s-Nuagaon,Dist-Nayagarh,Pin-752091"
                    }
                    onClick={() => {
                      setBackendLocation("Sorada");
                    }}
                  >
                    Sorada
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack>
              <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                Product Details
              </Typography>

              <Stack
                sx={{ direction: { lg: "row", sm: "coloumn" } }}
                gap="20px"
              >
                <Stack
                  sx={{ flexDirection: { xs: "column", sm: "row" } }}
                  gap="20px"
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={stockNames}
                    value={pname}
                    onChange={(e, v) => setPname(v)}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={({ target }) => setPname(target.value)}
                        label="Medicine Name"
                      />
                    )}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={stockRates}
                    value={rate}
                    onChange={(e, v) => setRate(v)}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={({ target }) => setRate(target.value)}
                        label="Rate"
                      />
                    )}
                  />
                  <TextField
                    label="Quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    value={quantity * rate}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Stack>
                <Stack sx={{ gap: "15px", flexDirection: { sm: "row" } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                      maxWidth: "200px",
                      padding: "16px 33px",
                      borderRadius: "42px",
                    }}
                  >
                    Add To Cart
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleprint}
                    sx={{
                      maxWidth: "200px",
                      padding: "16px 33px",
                      borderRadius: "42px",
                    }}
                  >
                    Preview Invoice
                  </Button>
                </Stack>
                <Box>
                  <TextField
                    label="Discount"
                    name="discount"
                    value={discount}
                    placeholder="Enter discount in (1%-15%)"
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </Box>
              </Stack>
            </Stack>
          </Stack>
          <Stack padding="50px">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((n) => {
                    return (
                      <TableRow key={n.pname}>
                        <TableCell>{n.pname}</TableCell>
                        <TableCell>{n.quantity}</TableCell>
                        <TableCell>{n.rate}</TableCell>
                        <TableCell>{n.quantity * n.rate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan="3"
                      align="right"
                      sx={{ fontWeight: "700" }}
                    >
                      Sub-Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>{amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan="3"
                      align="right"
                      sx={{ fontWeight: "700" }}
                    >
                      Total Discount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>
                      {(amount * discount) / 100}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan="3"
                      align="right"
                      sx={{ fontWeight: "700" }}
                    >
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>{total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      )}

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError1}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          "Don't Leave Any InputField Empty"
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
