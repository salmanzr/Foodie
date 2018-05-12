var accounts;
var factoryInstance;
var defaultGas = 4700000;
var userAccounts = [];
var aggregatorAccount, farmerAccount, warehouseAccount, currentAccount;
var hostName = "localhost";
var ipfs = window.IpfsApi(hostName, 5001);

function deployProduceFactory() {
    ProduceFactory.new({ from: currentAccount, gas: defaultGas }).then(
        function(facInstance) {
            factoryInstance = facInstance;
            $("#deployContractSuccess").html('<i class="fa fa-check"</i>' + " Produce Tracker Contract mined!");
            initializeFactoryEvents();            
        });
}

function initializeFactoryEvents() {
    var events = factoryInstance.allEvents();
    events.watch(function(error, result) {
        if (error) {
            console.log("Error: " + error);
        } else {
            $('#audittrailbody').append('<tr><td>' + result.event +
                '</td><td>' + parseInt(result.args._produceId) +
                '</td><td>' + result.args._person +
                '</td><td>' + "<a target='_blank' href='http://" + hostName + ":8080/ipfs/" + result.args._hash + "'>" + result.args._hash + "</a>" +
                '</td><td>' + Date(result.args._time) + '</td>');
        }
    });
}

function readProduceById(_produceId) {
    document.getElementById("produceId").style.display = "block";
    document.getElementById('theProduceId').innerHTML = _produceId;
    factoryInstance.getQuantity.call(_produceId).then(function(data) {
        document.getElementById('theQuantity').innerHTML = data.toString(10);
      
    });
    factoryInstance.getDate.call(_produceId).then(function(data) {
        //document.getElementById('theDate').innerHTML = data.toString(10);
        $("#theDate").html(moment.unix(data.c[0]).format("MM/DD/YYYY"));
    });    
}

function store() {
    const file = document.getElementById('source').files[0]
    const reader = new FileReader()
    reader.onload = function() {
        var toStore = buffer.Buffer(reader.result);
        ipfs.add(toStore, function(err, res) {
            if (err || !res) {
                return console.error('ipfs add error', err, res)
            }

            res.forEach(function(file) {
                console.log('successfully stored', file);
                submitQRCode(file.path);
                readProduceById(0);
                display(file.path);
            })
        })
    }
    reader.readAsArrayBuffer(file)
}

function submitQRCode(docHash) {
    console.log(docHash);
    var quantity = $("#inputQuantity").val();
    var myDate = $("#inputDate").val();
    var dateTs = (moment(myDate, "M/D/YYYY").valueOf()) / 1000;
    factoryInstance.createProduce.sendTransaction(docHash, dateTs, quantity, {from:farmerAccount, gas:defaultGas}).then(
        function(txHash) {
            console.log("Submitting qr code hash with produce ", txHash);
            $("#uploadIpfsSuccess").html('<i class="fa fa-check"</i>' + ' IPFS Dataset Hash ' + docHash + " added to IPFS");
            $("#uploadDatasetSuccess").html('<i class="fa fa-check"</i>' + ' Transaction ' + txHash + " added to the blockchain");
        }
    );
}

function display(hash) {
    document.getElementById('hash').innerHTML =
        "<a target='_blank' href='http://" + hostName + ":8080/ipfs/" + hash + "'>" + hash + "</a>";
}

function doDeliveries() {
    factoryInstance.executeDelivery.sendTransaction(0, warehouseAccount, { from: aggregatorAccount, gas: defaultGas}).then(
        function(txHash) {
            console.log("Doing aggregation and sending to warehouse ", txHash);
            $("#aggregationSuccess").html('<i class="fa fa-check"</i>' + ' Aggregation ' + txHash + " added to the blockchain");
        }
    );
    factoryInstance.getQRCode.call(0).then(function(data) {
      $('#producesbody').append('</td><td>' + parseInt(0) + '</td><td>' + data.toString(10));
    });
    factoryInstance.getFarmer.call(0).then(function(data) {
        $('#producesbody').append('</td><td>' + data.toString(10) + '</td>');
    });
}

$(function() {
    $("#inputDate").datepicker();    
});

function getBlockDetails(blockNo) {
    var block = web3.eth.getBlock(blockNo);
    $('#blkNum').html(block.number);
    $('#transactionCount').html(block.transactions.length);
    $('#transactions').html(block.transactions[0]);
    $('#timestamp').html(Date(block.timestamp));
    $('#difficulty').html(("" + block.difficulty).replace(/['"]+/g, ''));
    $('#nonce').html(block.nonce);
    $('#size').html(block.size);
    $('#miner').html(block.miner);
    $('#gasLimit').html(block.gasLimit);
    $('#gasUsed').html(block.gasUsed);
    $('#receiptRoot').html(block.receiptRoot);
    $('#stateRoot').html(block.stateRoot);
    $('#sha3Uncles').html(block.sha3Uncles);

    $('#modalBlockDetails').modal({
        keyboard: true,
        backdrop: "static"
    });
}

function getBlockInfo() {
    var maxBlocks = 100;
    var blockNum = parseInt(web3.eth.blockNumber, 10);
    if (maxBlocks > blockNum) {
        maxBlocks = blockNum + 1;
    }    
    blocks = [];
    for (var i = 0; i < maxBlocks; ++i) {
        blocks.push(web3.eth.getBlock(blockNum - i));
    }
    $("#”transactions tbody").empty();
    blocks.forEach(function(block) {
        for (var index = 0; index < block.transactions.length; index++) {
            var t = block.transactions[index];
            $('#transactionsbody').append('<tr><td><a  target="#" onclick="getBlockDetails(' + block.number + ');return false;" href="' + t.blockNumber +
                ' ">' + block.number + '</a></td><td>' + block.hash +
                '</td><td>' + block.parentHash +
                '</td>');
        }
    });

}

window.onload = function() {
    web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }
        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }
        accounts = accs;

        farmerAccount = accounts[0];
        currentAccount = accounts[0];
        aggregatorAccount = accounts[1];
        warehouseAccount = accounts[2];
        web3.eth.defaultAccount=web3.eth.accounts[0]

        userAccounts.push(farmerAccount);
        userAccounts.push(aggregatorAccount);
        userAccounts.push(warehouseAccount);
        $('#farmerAccount').html('User Account : ' + farmerAccount);
        $('#farmerBalance').html('User Balance : ' + web3.eth.getBalance(farmerAccount));
    });

    $("#accountSelect").change(function(e) {
        e.preventDefault();
        currentAccount = $("#accountSelect option:selected").val();
        currentAccountText = $("#accountSelect option:selected").text();
        var fields = currentAccountText.split('-');
        $('#actor').text(fields[1]);
        if (currentAccount == farmerAccount) {
            $('#mytabs a[href="#sectionA"]').tab('show');
        } else if (currentAccount == aggregatorAccount) {
            $('#mytabs a[href="#sectionB"]').tab('show');
        } else if (currentAccount == warehouseAccount) {
            $('#mytabs a[href="#sectionC"]').tab('show');
        }

    });

    $("#deployContract").click(function() {
        deployProduceFactory();
    });

    $("#doDeliveries").click(function() {
        doDeliveries();
    });

    $("#modalClose").click(function() {
        $('#modalBlockDetails').modal('hide');
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href") // activated tab
        if (target == "#sectionA") {
            $('#actor').text("Farmer");
            currentAccount = farmerAccount;
            $('#farmerAccount').html('User Account : ' + farmerAccount);
            $('#farmerBalance').html('User Balance : ' + web3.eth.getBalance(farmerAccount));
        } else if (target == "#sectionB") {
            $('#actor').text("Aggregator");
            currentAccount = aggregatorAccount;
            $('#aggregatorAccount').html('User Account : ' + aggregatorAccount);
            $('#aggregatorBalance').html('User Balance : ' + web3.eth.getBalance(aggregatorAccount));
        }  else if (target == "#sectionC") {
            $('#actor').text("Warehouse");
            currentAccount = warehouseAccount;
            $('#warehouseAccount').html('User Account : ' + warehouseAccount);
            $('#warehouseBalance').html('User Balance : ' + web3.eth.getBalance(warehouseAccount));
        }

        if (target = "#dropdown2") {
            getBlockInfo();
        }
    });
};

function demoLogin() {
    $( "#loginStatus" ).show();  
    
}