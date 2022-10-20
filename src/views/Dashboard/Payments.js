import React, { useRef, useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Box,
  Input,
  Heading,
  Select,
  Image,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/PaymentsTable.js";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import axios from "axios";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { NavLink, useHistory } from "react-router-dom";
import { AiFillDingtalkSquare } from "react-icons/ai";
import { SiJquery } from "react-icons/si";


function Tables() {
  const [customers, setCustomers] = useState([]);
  const [oldCustomers, setoldCustomers] = useState([]);
  const [oldload, setoldload] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [isMore, setisMore] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const textColor = useColorModeValue("gray.700", "white");
  const [customerType, setCustomerType] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDate, setfilterDate] = useState([null]);
  const [filterAmount, setfilterAmount] = useState([null]);
  const [filterStatus, setfilterStatus] = useState();
  const [filterMeta, setfilterMeta] = useState([]);
  const [filterCustomersdata, setfilterCustomersdata] = useState(false);
  const [filterApplied, setfilterApplied] = useState(false);
  const [filterPage, setfilterPage] = useState();
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [filterData, setfilterData] = useState({'email': null,
  amount:{
    value: null,
    operator:null,
  },
  date:{
    value: null,
    operator:null,
  },
  metadata: null,
  status: null

});
  const history = useHistory();
  let filterCustomersdataRef = false;
  

  const emailHandler = (email) => {
    setFilterEmail(email);
    //props.emailTextHandler(email);
  };

  function getFilterData(){
    // let options = {'email': null,
    // amount:{
    //   value: null,
    //   operator:null,
    // },
    // date:{
    //   value: null,
    //   operator:null,
    // },
    // metadata: {
    //     site_url: null,
    //     customer_email: null
    // },
    // status: null};

    let options = {};
    if(document.querySelector('input[name=payment-date]').value!==null && document.querySelector('input[name=payment-date]').value!=='' && document.querySelector('select[name=payment-date-operator]').value!==undefined && document.querySelector('select[name=payment-date-operator]').value!=='default'){
            //jQuery('')
        options['date'] = {'value': document.querySelector('input[name=payment-date]').value,
                            'operator': document.querySelector('select[name=payment-date-operator]').value};
        
        
    }
    if(document.querySelector('input[name=payment-amount]').value!==null && document.querySelector('input[name=payment-amount]').value!=='' && document.querySelector('select[name=payment-amount-operator]').value!==undefined && document.querySelector('select[name=payment-amount-operator]').value!=='default'){
        
        options['amount'] = {'value': document.querySelector('input[name=payment-amount]').value,
                            'operator': document.querySelector('select[name=payment-amount-operator]').value};
        
        
    }
    // if(document.querySelector('select[name=payment-status]')!==undefined){
        
    //     options['status'] = document.querySelector('input[name=payment-status]').value;
        
        
    // }
    // if(document.querySelector('select[name=payment-currency]')!==undefined){
        
    //     options['currency'] = document.querySelector('select[name=payment-currency]').value;
        
        
    // }
    
    if(document.querySelector('select[name=payment-metadata]').value === 'NLS' && document.querySelector('select[name=payment-metadata]').value !== 'default'){
            //options['metadata']['site_url'] = "https://nolimitsocial99.com"   
            options['metadata'] = { ...options['metadata'] , 'site_url': "https://nolimitsocial99.com"} 
    }

    if(document.querySelector('input[name=payment-metadata-email]').value !==null && document.querySelector('input[name=payment-metadata-email]').value !==''){
        //options['metadata']['customer_email'] = document.querySelector('input[name=payment-metadata-email]').value
        options['metadata'] = { ...options['metadata'] , 'customer_email': document.querySelector('input[name=payment-metadata-email]').value}
    }
    if(document.querySelector('select[name=payment-status]').value !==null && document.querySelector('select[name=payment-status]').value !=='' && document.querySelector('select[name=payment-status]').value!=='default'){
        options['status'] = document.querySelector('select[name=payment-status]').value    
    }
    


    if(!options){
        
        return null;
    }
    return options;
  }
  function getMoreCustomers(){
    let options = [];
    if(filterApplied){
        options = getFilterData();
        
        if(isMore){
            options['page'] = filterPage;
        }
        console.log(filterCustomersdataRef);
        var moreCustomers = filterCustomers(options,isMore?filterPage:null);
    }
    else{
        var table= document.querySelector('.customer-listing');
        var lastRow = table.rows[ table.rows.length - 1 ];
        
        options['starting_after']=lastRow.getAttribute('payment-data')
        var moreCustomers = getCustomersList(options);
    }
  }


  //Date Filter Function
  function searchPaymentsbyfilter(){

    filterCustomersdataRef = false;
    let options = [];
    options = getFilterData();

    if(Object.keys(options).length == 0){
        setfilterApplied(false)
        setisMore(oldload)
        setCustomers(oldCustomers);
        var moreCustomers = getCustomersList(null);
        
    }
    else{

        var moreCustomers = filterCustomers(options);
    }
 
  }


  function setStatus(){
    var a = document.querySelector('select[name=payment-status]').selectedIndex;
    setfilterStatus(document.querySelector('select[name=payment-status]').options[a].text);
  }
  const filterCustomers = async (options,limit,page) => {
    try {
    let data = {};
    setLoading(true);
      // if(options){
      //   options.forEach((item,index) => {
      //     console.log(Object.keys(options[index])+' => '+ item)
      //   })
      // }
        var params="";
        if(limit!==undefined){
            !params?params="?limit="+limit:params+="&limit="+limit
        }
        if(page!==undefined){
            !params?params="?page="+page:params+="&page="+page
        }
        if(options!==null && options !==undefined){

            Object.entries(options).forEach(([key, value]) => {data[key] = value; console.log(data)});
            // if(options.date!==null && options.date!==undefined && options.date.value!==null){
            //     // const bodyFormData = new FormData();
            //     // bodyFormData.append(filterDate.value, item);
            //     //data= {'created': {'value': filterDate.value, 'operator': filterDate.operator} };
            //     data['created'] = {'value' : options.date.value, 'operator': options.date.operator};
            //   }
            
            // if(options.amount!==null && options.amount.value!==null && options.amount!==undefined){
            //     data['amount'] = {'value' : options.amount.value, 'operator': options.amount.operator}
            //   }

            // if(options.status!==null && options.status!==undefined){
            //     data['status'] = options.status;
            // }
            // if(options.metadata!==undefined && options.metadata!==null){
            // if(options.metadata.site_url!==null){
            //     data['metadata'] = {...data['metadata'], 'site_url': options.metadata.site_url};
            // }
            // if(options.metadata.customer_email!==null && options.metadata!==undefined){
            //     data['metadata'] = {...data['metadata'], 'customer_email': options.metadata.customer_email};
            // }
        }
          
        



      const res = await axios.post(`${API_SERVER}payments/search`+params, JSON.stringify(data), {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
        
       
        
      });


      setLoading(false);
      let resdata = res.data.data.data;
      if(!options['page']){
        setCustomers(resdata);
        filterCustomersdataRef = true;
      }
      else{
        setCustomers((customers) => ([...customers, ...resdata]));
      }
      
    if(res.data.data.next_page!==null && res.data.data.has_more==true){
        setfilterPage(res.data.data.next_page)
       
    }
    setisMore(res.data.data.has_more)
    setfilterApplied(true);
      
      
      
    } catch (err) {
        console.log(err);
      if (err.response.status === 404) {
        alert('The requested resource was not found');
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        alert('Your session has expired!');
        history.push('auth/signin');
        console.log("Unauthorized!");
      } else {
        console.log(err.message);
      }
    }
  };

  const getCustomersList = async (options) => {
    try {
      setLoading(true);
      // if(options){
      //   options.forEach((item,index) => {
      //     console.log(Object.keys(options[index])+' => '+ item)
      //   })
      // }
        var params="";
       
        if(options!==null && options !==undefined){

            if(options.limit!==undefined){
                !params?params="?limit="+options.limit:params+="&limit="+options.limit
            }

            if(options.starting_after!==undefined){
                !params?params="?starting_after="+options.starting_after:params+="&starting_after="+options.starting_after
            }

            if(options.ending_before!==undefined){
                !params?params="?ending_before="+options.ending_before:params+="&ending_before="+options.ending_before
            }
            
        }
      
      const res = await axios.get(`${API_SERVER}payments/`+params, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      setLoading(false);
      let data = res.data.data.data;
      if(!customers){
        setCustomers(data);
        setoldCustomers(data);
      }
      else{
        setCustomers((customers) => ([...customers, ...data]));
        setoldCustomers((customers) => ([...customers, ...data]));
      }
      
      
    setisMore(res.data.data.has_more)
    setoldload(res.data.data.has_more)
      
      
      
    }  catch (err) {
        console.log(err);
      if (err.response.status === 404) {
        alert('The requested resource was not found');
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        alert('Your session has expired!');
        localStorage.removeItem('user');
       history.push('auth/signin');
       window.location.reload(false);
        console.log("Unauthorized!");
      } else {
        console.log(err.message);
      }
    }
  };




  function toStatus(val) {
    var str = "";
   
    if(val.status==="succeeded"){
        
        if(val.charges.data!==null){
            var data = val.charges.data[val.charges.data.length-1];
            if(data.refunded==true && data.refunds.data.length > 0){
                str = "refunded";

            }
            else{
                str=val.status;
            }
        }
        else{
            str=val.status;
        }
    }
    else
    {
        str=val.status;
    }

    
    const arr = str.split('_');
  
    const result = [];
  
    for (const word of arr) {
      result.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    //console.log(result);
    return result.join(' ');
  }

  // Converting date
  const datadate = (created) => {
    let epochDate = created;
    var formatedDateTime = new Date(epochDate * 1000);

    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  const dataamount = (amount) => {
    let cents = amount;
    var formatedDollars = (cents / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
    //formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDollars;
  };

  

  useEffect(() => {
  getCustomersList(null);

  }, []);


  useEffect(() => {
    //filterCustomers(null);
    // console.log(filterData);
    // console.log(isfilterApplied)
    // console.log(filterEmail)
  
    }, [isfilterApplied,filterData,filterEmail]);

  // Filtering Email
  const customerListing = customers.filter((customer) => {
    if (emailFilter == "") {
      return customer;
    } else if (emailFilter != "") {
      return customer.email == emailFilter ? customer : false;
    }
  });
  const emailTextHandler = (email) => {
    //console.log(email);
    setEmailFilter(email);
  };
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="0 0 30px 0">
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            Payments
          </Text>
        </CardHeader>
        <Box>
          {/* //<FilterCustomers emailTextHadler={emailTextHandler} /> */}
          <Flex className="filter_customers">
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            {filterEmail ? "Email | " + filterEmail : "Email"}
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight={"bold"}>Filter By Email</Text>
                <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => { emailHandler(""); filterData.email=null; setfilterData({...filterData}); document.querySelector('input[name=payment-metadata-email]').value=""; searchPaymentsbyfilter();}}
                >
                  <CloseIcon />
                </Button>
              </Flex>
              <Flex justifyContent="center" alignItems="center" my={3}>
                <Text fontSize={14} w={"50%"}>
                  is equal to
                </Text>
                <Input
                  placeholder="Enter customer email"
                  name="payment-metadata-email"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  id="filterEmail"
                />
              </Flex>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                // onClick={() => emailHandler(filterEmail)}
                onClick={() =>{emailHandler(filterEmail); searchPaymentsbyfilter();}}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            Amount
            <span style={{ color: "var(--chakra-colors-primaryColor-700)" }}>
              {filterAmount}
            </span>
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Text fontWeight={"bold"}>Filter By Amount</Text>
              <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => { setfilterAmount(''); document.querySelector('input[name=payment-amount]').value=''; searchPaymentsbyfilter();}}
                >
                  <CloseIcon />
                </Button>
              <Select my={3} name="payment-amount-operator" onChange={(e) => {filterData.amount.operator=e.target.value; setfilterData({...filterData});}}>
              <option defaultValue disabled value="default">Please select an option</option>
              <option value="=">is equal to</option>
                <option value=">">is greater than</option>
                <option value="<">is less than</option>
              </Select>
              <Input type="number" name="payment-amount" onChange={(e) => {filterData.amount.value=e.target.value; setfilterData({...filterData});}} />
              <Button
                w={"100%"}
                onClick={() => { setfilterAmount(' '+document.querySelector('select[name=payment-amount-operator]').value+' $'+document.querySelector('input[name=payment-amount]').value); searchPaymentsbyfilter();}}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            Created date
            <span style={{ color: "var(--chakra-colors-primaryColor-700)" }}>
              {filterDate}
            </span>
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Text fontWeight={"bold"}>Filter By Date</Text>
              <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => { setfilterDate(''); document.querySelector('input[name=payment-date]').value=''; searchPaymentsbyfilter();}}
                >
                  <CloseIcon />
                </Button>
              <Select my={3} name="payment-date-operator">
              <option defaultValue disabled value="default">Please select an option</option>
                <option value="=">is equal to</option>
                <option value=">">is after</option>
                <option value="<">is before</option>
                
              </Select>
              <Input type="date" name="payment-date" />
              <Button
                onClick={() => { setfilterDate(' '+document.querySelector('select[name=payment-date-operator]').value+document.querySelector('input[name=payment-date]').value); searchPaymentsbyfilter();}}
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                mt={3}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            {"Customer Type"} |{" "}
            <span style={{ color: "var(--chakra-colors-primaryColor-700)" }}>
              {customerType}
            </span>
          </MenuButton>
          <MenuList>
            <Box p={3}>
            <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => { setCustomerType(''); document.querySelector('select[name="payment-metadata"]').selectedIndex=0; searchPaymentsbyfilter();}}
                >
                  <CloseIcon />
                </Button>
            <Select my={3} name="payment-metadata">
              <option defaultValue value="default">Please select an option</option>
                <option value="NLS">NLS</option>  
              </Select>
                <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                // onClick={() => setCustomerType("NLS")}
                onClick={() => { setCustomerType("NLS"); searchPaymentsbyfilter();}}
                mt={3}
              >
                Apply
              </Button> 
              {/* <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                onClick={() => setCustomerType("SpiritMagnet")}
                mt={3}
              >
                SpiritMagnet
              </Button>  */}
            </Box>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            {"Status"} |{" "}
            <span style={{ color: "var(--chakra-colors-primaryColor-700)" }}>
              {filterStatus}
            </span>
          </MenuButton>
          <MenuList>
            <Box p={3}>
            <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => { setfilterStatus(''); document.querySelector('select[name="payment-status"]').selectedIndex=0; searchPaymentsbyfilter();}}
                >
                  <CloseIcon />
                </Button>
            <Select my={3} name="payment-status">
              <option defaultValue value="default">Please select an option</option>
                <option value="succeeded">Succeeded</option>
                <option value="requires_capture">Requires Capture</option> 
                <option value="requires_confirmation">Incomplete</option> 
                <option value="canceled">Canceled</option>
                <option value="requires_payment_method">Requires Payment Method</option> 
                <option value="processing">Processing</option>
              </Select>
                <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                // onClick={() => setCustomerType("NLS")}
                onClick={() => { setStatus(); searchPaymentsbyfilter();}}
                mt={3}
              >
                Apply
              </Button> 
              {/* <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                onClick={() => setCustomerType("SpiritMagnet")}
                mt={3}
              >
                SpiritMagnet
              </Button>  */}
            </Box>
          </MenuList>
        </Menu>
        
      </Flex>

        </Box>
        {!isloading ? (
          <>
            <CardBody>
              <Table variant="simple" color={textColor} className="customer-listing">
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" color="gray.400">
                      Amount
                    </Th>
                    <Th pl="0px" color="gray.400">
                      Status
                    </Th>
                    <Th color="gray.400">Description</Th>
                    <Th color="gray.400">Customer</Th>
                    <Th color="gray.400">Date</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody className="customer_body" textTransform={"capitalize"}>
                  {customerListing.map((val, index) => {
                    
                    return (
                      <TablesTableRow
                        cusid= {val.id}
                        amount= {dataamount(val.amount)}
                        key={index}
                        status={toStatus(val)}
                        // email={val.email}
                        desc={val.description}
                        customer={val.metadata.customer_email?val.metadata.customer_email:val.receipt_email}
                        // status={
                        //   val.invoice_settings.default_payment_method || "VISA"
                        // }
                        date={datadate(val.created)}
                        viewprofile={val.id}
                      />
                    );
                  })}
                  {/* {tablesTableData.map((row) => {
                return (
                  <TablesTableRow
                    name={row.name}
                    // logo={row.logo}
                    email={row.email}
                    subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
                  />
                );
              })} */}
                </Tbody>
              </Table>
            </CardBody>
          </>
        ) : (
          <Box>
            <Flex
              h="50vh"
              justifyContent="center"
              alignItems="center"
              direction={"column"}
            >
              <Heading>Listing Payments...</Heading>
              <Image src={LoadingGif} w={100} />
            </Flex>
          </Box>
        )}
        {isMore?        <Button
          onClick={getMoreCustomers}
          bg="teal.300"
          w={200}
          color="white"
          m={"20px auto"}
          _hover={{ bg: "#000" }}
          p="25px 0"
        >
          Load More
        </Button>: ""}
        <Box>
            <Flex
              h="50vh"
              justifyContent="center"
              alignItems="center"
              direction={"column"}
            >
              <p>Showing {customers.length} of Payments</p>
              
            </Flex>
          </Box>
      </Card>
      {/* <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
      >
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Projects Table
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px">
                <Th pl="0px" color="gray.400">
                  Companies
                </Th>
                <Th color="gray.400">Budget</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Completion</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesProjectData.map((row) => {
                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    status={row.status}
                    budget={row.budget}
                    progression={row.progression}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card> */}
    </Flex>
  );
}

export default Tables;