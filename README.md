<p align="center">
  <img src="./logo.png" alt="MARIA Logo"/>
</p>

An application that allows foodies to know where exactly their food came from.


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

### 7. Close the web app

1. Close the application window
2. ```ctrl-c``` in each of the 3 terminal windows
