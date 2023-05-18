$(window).bind("load", function() {

    var rpc_nodes = [
        "https://api.deathwing.me",
		"https://hive.roelandp.nl",
		"https://api.openhive.network",
		"https://rpc.ausbit.dev",
		"https://hived.emre.sh",
		"https://hive-api.arcange.eu",
		"https://api.hive.blog",
		"https://api.c0ff33a.uk",
		"https://rpc.ecency.com",
		"https://anyx.io",
		"https://techcoderx.com",
		"https://api.hive.blue",
		"https://rpc.mahdiyari.info"
    ];

    var he_rpc_nodes = [
        "https://engine.rishipanthee.com", 
		"https://ha.herpc.dtools.dev", 
		"https://api.hive-engine.com",
		"https://api.primersion.com",
		"https://herpc.actifit.io"
    ];

    let ssc;
    
    async function checkHiveNodeStatus(nodeUrl, statusElement) {
        try 
        {
            const response = await axios.get(nodeUrl);
            if (response.status === 200) 
            {
                statusElement.textContent = "Working";
                statusElement.classList.remove("fail"); // Remove "fail" class if present
                statusElement.classList.add("working");
            } 
            else 
            {
                statusElement.textContent = "Fail";
                statusElement.classList.remove("working"); // Remove "working" class if present
                statusElement.classList.add("fail");
            }
        } 
        catch (error) 
        {
          statusElement.textContent = "Fail";
          statusElement.classList.remove("working"); // Remove "working" class if present
          statusElement.classList.add("fail");
        }
    };
      
    async function addHiveNodes() {
        try 
        {
            const tableBody = document.querySelector("#api-list-hive tbody");
            const workingNodes = [];
            const failedNodes = [];
        
            for (let i = 0; i < rpc_nodes.length; i++) 
            {
                const nodeUrl = rpc_nodes[i];
                const row = document.createElement("tr");
                const urlCell = document.createElement("td");
                const statusCell = document.createElement("td");
        
                urlCell.textContent = nodeUrl;
                urlCell.classList.add("node-url"); // add new class to url cell
                statusCell.textContent = "Checking...";
        
                row.appendChild(urlCell);
                row.appendChild(statusCell);
        
                tableBody.appendChild(row);
        
                // Check node status
                checkHiveNodeStatus(nodeUrl, statusCell);
        
                // Check node status every minute
                setInterval(() => checkHiveNodeStatus(nodeUrl, statusCell), 60 * 1000);
            }
      
            // Reorder the list of nodes based on their status
            setTimeout(() => {
                const rows = Array.from(tableBody.getElementsByTagName("tr"));
        
                rows.forEach((row) => {
                    if (row.lastChild.textContent === "Working") 
                    {
                        workingNodes.push(row);
                    } 
                    else 
                    {
                        failedNodes.push(row);
                    }
                });
        
                tableBody.innerHTML = "";
        
                // Append workingNodes first, then failedNodes
                workingNodes.forEach((row) => {
                    tableBody.appendChild(row);
                });
        
                failedNodes.forEach((row) => {
                    tableBody.appendChild(row);
                });
            }, 5000);
        } 
        catch (error) 
        {
            console.log("Error at addHiveNodes(): ", error);
        }
    };    

    async function checkEngineNodeStatus(nodeUrl, statusElement) {
        try 
        {
            const response = await axios.get(nodeUrl);
            if (response.status === 200) 
            {
                statusElement.textContent = "Working";
                statusElement.classList.remove("fail"); // Remove "fail" class if present
                statusElement.classList.add("working");
            } 
            else 
            {
                statusElement.textContent = "Fail";
                statusElement.classList.remove("working"); // Remove "working" class if present
                statusElement.classList.add("fail");
            }
        } 
        catch (error) 
        {
          statusElement.textContent = "Fail";
          statusElement.classList.remove("working"); // Remove "working" class if present
          statusElement.classList.add("fail");
        }
    };

    async function addEngineNodes() {
        try 
        {
            const tableBody = document.querySelector("#api-list-engine tbody");
            const workingNodes = [];
            const failedNodes = [];
        
            for (let i = 0; i < he_rpc_nodes.length; i++) 
            {
                const nodeUrl = he_rpc_nodes[i];
                const row = document.createElement("tr");
                const urlCell = document.createElement("td");
                const statusCell = document.createElement("td");
        
                urlCell.textContent = nodeUrl;
                urlCell.classList.add("node-url"); // add new class to url cell
                statusCell.textContent = "Checking...";
        
                row.appendChild(urlCell);
                row.appendChild(statusCell);
        
                tableBody.appendChild(row);
        
                // Check node status
                checkEngineNodeStatus(nodeUrl, statusCell);
        
                // Check node status every minute
                setInterval(() => checkEngineNodeStatus(nodeUrl, statusCell), 60 * 1000);
            }
      
            // Reorder the list of nodes based on their status
            setTimeout(() => {
                const rows = Array.from(tableBody.getElementsByTagName("tr"));
        
                rows.forEach((row) => {
                    if (row.lastChild.textContent === "Working") 
                    {
                        workingNodes.push(row);
                    } 
                    else 
                    {
                        failedNodes.push(row);
                    }
                });
        
                tableBody.innerHTML = "";
        
                // Append workingNodes first, then failedNodes
                workingNodes.forEach((row) => {
                    tableBody.appendChild(row);
                });
        
                failedNodes.forEach((row) => {
                    tableBody.appendChild(row);
                });
            }, 5000);
        } 
        catch (error) 
        {
            console.log("Error at addEngineNodes(): ", error);
        }
    };  
    
    async function initializeHiveAPI() {
        var selectedEndpoint = await getSelectedEndpoint();
        console.log("SELECT HIVE API NODE : ", selectedEndpoint);
        hive.api.setOptions({ url: selectedEndpoint });

        var button = document.getElementById("popup-button-hive");
        button.value = selectedEndpoint;
        button.innerHTML = selectedEndpoint;
    }

    async function initializeEngineAPI() {
        var selectedEngEndpoint = await getSelectedEngEndpoint();
        console.log("SELECT ENGINE API NODE : ", selectedEngEndpoint);
        ssc = new SSC(selectedEngEndpoint);

        var button = document.getElementById("popup-button-engine");
        button.value = selectedEngEndpoint;
        button.innerHTML = selectedEngEndpoint;
    }

    async function processAPIs() {
        try {
            await addHiveNodes();
            await addEngineNodes();
            await initializeHiveAPI();
            await initializeEngineAPI();
            refresh();
        } 
        catch (error) 
        {
            console.log("Error while processing APIs: ", error);
        }
    };
      
    processAPIs();    

    hive.config.set('alternative_api_endpoints', rpc_nodes);

    // remove unnessary parameters from url

    window.history.replaceState({}, document.title, "/" + "");

    var user = null, bal = { UPME: 0, WINEX: 0 }, marketvalues;

    const min = {
        UPME: 10,
        WINEX: 2
    };


    function dec(val) {

        return Math.floor(val * 1000) / 1000;

    }

    async function getHistory () {
        const historyRaw = await hive.api.getAccountHistoryAsync("hiveupme", -1, 100, '1', null);        

        // loop through history and create an array with only tx id, author, link and timestamp
        let history = historyRaw.map((tx) => {
            const { timestamp, op, trx_id } = tx[1];
            const { author, permlink, weight, voter } = op[1];           
            return { timestamp, author, permlink, weight, trx_id, voter };
        });

        // filter out only vote transactions with weight > 0
        history = history.filter((tx) => {
            return tx.voter == "hiveupme" && tx.weight > 0;
        });

        // fitler out only last 10 transactions
        history = history.slice(-10);

        // reverse the array so that the latest transaction is on top
        history = history.reverse();

        console.log(history);

        // loop through history and create html (author (with @), permlink (link to the post with first 10 characters), weight (in percent), timestamp string date, tx id (last 6 characters))
        history.forEach((tx) => {            
            const { timestamp, author, permlink, weight, trx_id, voter } = tx;
            const date = new Date(timestamp);
            const dateString = date.toDateString();
            const timeString = date.toLocaleTimeString();
            const txIdShort = trx_id.slice(-15);
            const permlinkShort = permlink.slice(0, 20);
            const weightPercent = weight / 100;
            const html = `
                <tr style="font-size:20px">
                    <td><a class="link-info" href="https://peakd.com/@${author}" target="_blank">@${author}</a></td>
                    <td><a class="link-info" href="https://peakd.com/@${author}/${permlink}" target="_blank">${permlinkShort}...</a></td>
                    <td>${weightPercent}%</td>
                    <td>${dateString} ${timeString}</td>
                    <td><a class="link-info" href="https://hiveblocks.com/tx/${trx_id}" target="_blank">${txIdShort}...</a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                    </svg>
                    </td>
                </tr>
            `;
            $("#history").append(html);
        });

        // show history table
        $("#historycard").removeClass("d-none");
        // add flex
        $("#historycard").addClass("d-flex");
    }

    getHistory();

    // on clicke refresh history button
    $("#refreshHistory").click(() => {
        // Empty history table with a fade-out effect
        $("#history").fadeOut(200, function() {
            $(this).empty();
            // Set a small timeout before executing getHistory()
            setTimeout(() => {
                getHistory();
                // Fade-in the history table after the data is loaded
                $("#history").fadeIn(200);
            }, 500); // Adjust the timeout value (in milliseconds) as needed
        });
    });
    
    $(document).ready(function() {
        // Get a reference to the button and the popup container
        var buttonHive = document.getElementById("popup-button-hive");
        var popupHive = document.getElementById("popup-container-hive");        

        // Add an event listener to the button
        buttonHive.addEventListener("click", function() {
            // Show the popup
            popupHive.style.display = "block";
        });

        // Get a reference to the API list table body
        var tableBodyHive = document.querySelector("#api-list-hive tbody");

        // Add event listeners to the rows in the table body
        var rowsHive = tableBodyHive.getElementsByTagName("tr");
        for (var i = 0; i < rowsHive.length; i++) 
        {
            rowsHive[i].addEventListener("click", function(event) {
                // Prevent the default link behavior
                event.preventDefault();

                // Get the node URL from the first cell in the row
                var nodeUrl = this.cells[0].textContent;

                // Set the API endpoint to the selected node
                hive.api.setOptions({ url: nodeUrl });

                // Update the button text
                buttonHive.value = nodeUrl;
                buttonHive.innerHTML = nodeUrl;

                // Save the selected endpoint to local storage
                localStorage.setItem("selectedEndpoint", nodeUrl);

                // Hide the popup
                popupHive.style.display = "none";

                // Reload the page after 1 second (adjust the time as needed)
                setTimeout(function() {
                    location.reload();
                }, 1000);
            });
        }

        // Add an event listener to the close button
        var closeButtonHive = document.getElementById("close-button-hive");
        closeButtonHive.addEventListener("click", function() {
            // Hide the popup
            popupHive.style.display = "none";
        });
        
        /*
        *   HE RPC NODES
        */


        // Get a reference to the button and the popup container
        var buttonEngine = document.getElementById("popup-button-engine");
        var popupEngine = document.getElementById("popup-container-engine");        

        // Add an event listener to the button
        buttonEngine.addEventListener("click", function() {
            // Show the popup
            popupEngine.style.display = "block";
        });

        // Get a reference to the API list table body
        var tableBodyEngine = document.querySelector("#api-list-engine tbody");

        // Add event listeners to the rows in the table body
        var rowsEngine = tableBodyEngine.getElementsByTagName("tr");
        for (var i = 0; i < rowsEngine.length; i++) 
        {
            rowsEngine[i].addEventListener("click", function(event) {
                // Prevent the default link behavior
                event.preventDefault();

                // Get the node URL from the first cell in the row
                var nodeUrl = this.cells[0].textContent;

                // Set the API endpoint to the selected node
                ssc = new SSC(nodeUrl);

                // Update the button text
                buttonEngine.value = nodeUrl;
                buttonEngine.innerHTML = nodeUrl;

                // Save the selected endpoint to local storage
                localStorage.setItem("selectedEngEndpoint", nodeUrl);

                // Hide the popup
                popupEngine.style.display = "none";

                // Reload the page after 1 second (adjust the time as needed)
                setTimeout(function() {
                    location.reload();
                }, 1000);
            });
        }

        // Add an event listener to the close button
        var closeButtonEngine = document.getElementById("close-button-engine");
        closeButtonEngine.addEventListener("click", function() {
            // Hide the popup
            popupEngine.style.display = "none";
        });
    });

    
    async function getBridge () {
        try
        {
            const res = await hive.api.getAccountsAsync(['uswap']);
            console.log("res : ", res);
            const res2 = await ssc.findOne("tokens", "balances", { account: 'uswap', symbol: 'SWAP.HIVE' });
            console.log("res2 : ", res2);
            $("#hive_liq").text(parseInt(res[0].balance.split(" ")[0]));
            $("#swap_liq").text(parseInt(res2.balance));
            $("#bridge").removeClass("d-none");
        }
        catch (error)
        {
            console.log("Error at getBridge : ", error);
        }
    }    

    getBridge();


    async function getBalances (account) {
        try 
        {
            const res = await hive.api.getAccountsAsync([account]);
            if (res.length > 0) 
            {
                const res2 = await ssc.find("tokens", "balances", { account, symbol: { "$in": ["UPME", "WINEX"] } }, 1000, 0, []);
                var upme = res2.find(el => el.symbol === "UPME");
                var winex = res2.find(el => el.symbol === "WINEX");
                return {
                    UPME: dec(parseFloat((upme) ? upme.balance : 0)),
                    WINEX: dec(parseFloat((winex) ? winex.balance : 0))
                }
            } 
            else 
            {
                return { UPME: 0, WINEX: 0 };
            }
        }
        catch (error)
        {
            console.log("Error at getBalances : ", error);
        }
    }


    async function getMarket (symbols) {
        try
        {
            const res = await ssc.find("market", "metrics", { symbol: { "$in": [...symbols] } }, 1000, 0, []);            
            const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd");
            var UPME = res.find(el => el.symbol === "UPME");
            var WINEX = res.find(el => el.symbol === "WINEX");
            return {
                HIVE: data.hive.usd,
                UPME,
                WINEX
            }
        }
        catch (error)
        {
            console.log("Error at getMarket : ", error);
        }
    }


    async function refresh () {
        try
        {
            updateMin();
            marketvalues = await getMarket(["UPME", "WINEX"]);
            $("#upme_price").text(marketvalues.UPME.lastPrice);
            $("#winex_price").text(marketvalues.WINEX.lastPrice);
            $("#upme_value").text((marketvalues.UPME.lastPrice * marketvalues.HIVE).toFixed(8));
            $("#winex_value").text((marketvalues.WINEX.lastPrice * marketvalues.HIVE).toFixed(8));
        }
        catch (error)
        {
            console.log("Error at refresh : ", error);
        }
    };



    $("#refresh").click(async function () {

        $(this).attr("disabled", true);

        await refresh();

        $(this).removeAttr("disabled");

    });



    function updateMin () {

        const symbol = $("#input").val();

        $("#minimum").text(`${min[symbol]} ${symbol}`);

    }



    async function updateBurn(r) {

        try {

            const symbol = $("#input").val();

            const val = $("#inputquantity").val();

            const post_link = $("#post").val();



            updateMin();



            const {

                lastPrice,

                lastDayPrice

            } = marketvalues[symbol];

            let es_val = (parseFloat(lastPrice) + parseFloat(lastDayPrice)) / 2;

            es_val *= marketvalues.HIVE;

            es_val *= val;

            es_val = dec(es_val);

            $("#es_val").text(`$ ${es_val}`);



            function isMin(val) {

                if (val >= min[symbol]) return true;

                else return false;

            }



            if (isMin(val)

                && bal[symbol] >= val

                && post_link.length > 0

                ) {

                $("#swap").removeAttr("disabled");

                if (r) r(true, parseFloat(val).toFixed(3), symbol, post_link);

            } else {

                $("#swap").attr("disabled", "true");

                if (r) r(false, 0, 0, comment);

            }

        } catch (e) {

            console.log(e);

        }

    }



    $(".s").click(function () {

        $("#input").val($(this).find(".sym").text());

        $("#inputquantity").val($(this).find(".qt").text());

        updateBurn();

    });



    $("#inputquantity").keyup(() => { updateBurn(); });

    $("#input").change(() => { updateBurn(); });

    $("#post").keyup(() => { updateBurn(); });



    async function updateBalance() {

        bal = await getBalances(user);



        $("#upme").text(bal.UPME.toFixed(3));

        $("#winex").text(bal.WINEX.toFixed(3));

    }



    $("#checkbalance").click(async function() {

        user = $.trim($("#username").val().toLowerCase());

        if (user.length >= 3) {

            $(this).attr("disabled", "true");

            await updateBalance();

            updateBurn();

            $(this).removeAttr("disabled");

            localStorage['user'] = user;

        }

    });



    if (localStorage['user']) {

        $("#username").val(localStorage['user']);

        user = localStorage['user'];

        updateBalance();

    }



    function isValid (post) {

        const valid_diffence = 18 * 60 * 60 * 1000;

        const { created } = post;

        var timeISO = created + '.000Z';
        const created_timestamp = new Date(timeISO).getTime();
        const current_timestamp = new Date().getTime();
        const diff = current_timestamp - created_timestamp;         

        if (diff > valid_diffence) return false;
        else return true;
    }



    $("#swap").click(async function () {

        $("#swap").attr("disabled", "true");

        $("#loading").removeClass("d-none");

        $("#status").text("Please Wait...");

        await refresh();

        await updateBalance();

        updateBurn(async function(canBurn, amount, currency, post_link) {

            if (canBurn) {

                $("#swap").attr("disabled", "true");



                let post = false;

                try {

                    const author = post_link.split("@")[1].split("/")[0];

                    const link = post_link.split("@")[1].split("/")[1];

                    post = await hive.api.getContentAsync(author, link);

                    if (!post.created) throw error;

                } catch (e) {

                    $("#status").text("Invalid Post Link");

                    $("#swap").removeAttr("disabled");

                    $("#loading").addClass("d-none");

                    return;

                }

    

                if (!post) {

                    $("#status").text("Invalid Post Link");

                    $("#swap").removeAttr("disabled");

                    $("#loading").addClass("d-none");

                    return;

                }



                if (!isValid(post)) {

                    $("#status").text("Post is older than 18 hours");

                    $("#loading").addClass("d-none");

                    $("#swap").removeAttr("disabled");

                    return;

                };



                $("#loading").addClass("d-none");

                $("#status").text(`Confirm the transaction through Keychain.`);



                try {

                    hive_keychain.requestHandshake();

                } catch (e) {

                    $("#loading").addClass("d-none");

                    $("#status").text("No method of transaction available, Install Keychain.");

                    updateBurn();

                }

                

                if (currency === "UPME") {

                    hive_keychain.requestSendToken(

                        user,

                        "upme.burn",

                        amount,

                        post_link,

                        currency,

                        async function (res) {

                            if (res.success === true) {

                                $("#status").text("Successfully Sent To Burn!");

                                $("#status").addClass("text-success");

                                await updateBalance();

                                updateBurn();

                            } else {

                                $("#status").text("Transaction failed, Please try again.");

                                updateBurn();

                            }

                            console.log(res);

                        }

                    );

                } else if (currency === "WINEX") {

                    hive_keychain.requestSendToken(

                        user,

                        "winex.burn",

                        amount,

                        post_link,

                        currency,

                        async function (res) {

                            if (res.success === true) {

                                $("#status").text("Successfully Sent To Burn!");

                                $("#status").addClass("text-success");

                                await updateBalance();

                                updateBurn();

                            } else {

                                $("#status").text("Transaction failed, Please try again.");

                                updateBurn();

                            }

                            console.log(res);

                        }

                    );

                }

            } else {

                $("#loading").addClass("d-none");

                $("#status").text('Account balance updated, Try Again.');

                updateBurn();

            }

        });

    });

    // setInterval(() => { refresh(); updateBalance(); }, 5000);

});

async function getSelectedEndpoint() {
    var endpoint = await localStorage.getItem("selectedEndpoint");
    if (endpoint) 
    {
      return endpoint;
    } 
    else 
    {
      return "https://anyx.io";
    }
};

async function getSelectedEngEndpoint() {
    var endpoint = await localStorage.getItem("selectedEngEndpoint");
    if (endpoint) 
    {
      return endpoint;
    } 
    else 
    {
      return "https://engine.rishipanthee.com";
    }
};