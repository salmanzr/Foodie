# [MARIA](https://drive.google.com/open?id=1jz1hjcnPLtWfOzVeis9c07rZ7M220D48) - Artificial Intelligence Research Assitant for Medicine

<p align="center">
  <img src="./logo.png" alt="MARIA Logo"/>
</p>

An application that allows physicians/researchers to create machine learning competitions that are facilitated by smart contracts on a private Ethereum blockchain and IPFS for data sharing. The goal is to show that physicians can use crowdsourced machine learning on medical data to make clinical decisions without sacrificing patient data privacy.


## Technical Requirements

[Node.js v6+ LTS and npm](https://nodejs.org/en/)

[Truffle v3.2.1](http://truffleframework.com/):

```
npm install -g truffle@3.2.1
```

[IPFS](https://ipfs.io/docs/install/):

Download the linked ^ package, open terminal, and do:

```
tar xvfz go-ipfs.tar.gz
mv go-ipfs/ipfs /usr/local/bin/ipfs
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'
ipfs config --json API.HTTPHeaders.Access-Control-Expose-Headers '["Location"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

[iExec](https://iex.ec/):
```
npm install -g iexec
```

## Setup

### 1. Clone repository and install necessary modules
```
git clone https://github.gatech.edu/gt-hit-spring2018/Artificial-Intelligence-Research-Assitant-for-Medicine maria
cd maria
npm install
```
### 2. Initialize the blockchain with test accounts
```
testrpc
```
### 3. Initialize IPFS
In a new terminal window:
```
ipfs daemon
```
### 4. Compile and deploy smart contracts onto the blockchain
In a new terminal window:
```
truffle migrate
```
### 5. Start the web app
```
truffle serve -p 8081
```  
The app will be served at http://localhost:8081, but any web server will work.
    
### 6. Use the web app
In its current state, the application is lacking almost all functionality and very buggy.
Follow these steps to see what it can do right now:

1. Click Blockchain View Tab -> Block Explorer to see transactions when we deployed our smart contract.
    
2. Click Physician Tab (notice the 'User Account' which is the address of the physician taken from the
test accounts that testrpc provides) -> 'Initiate the competition factory' to initialize our smart contract.
    
3. Click Blockchain View Tab -> Audit Tab to see history of all events that occured in our smart contract.
    
4. Fill the forms of 'prize' and 'deadline' with integers. We store deadline in seconds as 'Epoch Time'.
    
5. Click 'Submit Dataset' and upload a file to IPFS and initialize a competition.
    
6. Click Scientist Tab (the User Account changed and "Logged in as Scientist"). Here is a list of 
competitions, currently it only works with 1 competition, and it can't display any data except 
for the dataset the physician uploaded (click on the hash)
    
7. The submit buttons on Scientist Tab don't work, but the scientists should be able to browse 
competitions and participate in them. Anyone can push the payouts button but it will only work after
the deadline. The reason we can't automatically distribute payouts is because smart contract functions
must be initially called by an external account, and don't stay "running".
    
8. Leaderboard tab shows the top scientists, but this is not working yet.
    
9. The app it not using any machine learning yet, check out the machine_learning folder for an idea
of what needs to be done.

### 7. Close the web app

1. Close the application window
2. ```ctrl-c``` in each of the 3 terminal windows


##  Documentation:

http://solidity.readthedocs.io/en/latest/
