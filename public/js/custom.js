function itemDeleteCallback(event) {
    event.preventDefault();
    var id = $(this).data("id");
    bootbox.confirm("Are you sure you want to delete this item?",
        function(result) {
            if (result) {
                $.ajax({
                    url: "/items/" + id,
                    method: "DELETE",
                    success: function(data) {
                        $("#" + id).remove();
                    }
                });
            }
        });
};

function itemDetailCallback(data) {
    
    $("#detailModal .modal-body #date").text(moment(data.date).utc().format("YYYY-MM-DD"));
    $("#detailModal .modal-body #product").text(data.product);
    if (data.brand)
        $("#detailModal .modal-body #brand").text(data.brand.name);

    $("#detailModal .modal-body #upp").text(data.upp);
    if (data.weight) {
        $("#detailModal .modal-body #weight").text(data.weight);
        $("#detailModal .modal-body #unit").text(data.unit);
        if (data.unit_cost)
            $("#detailModal .modal-body #unit_cost").text(" x " + data.unit_cost);
    }
    $("#detailModal .modal-body #units_bought").text(data.units_bought);
    $("#detailModal .modal-body #item_cost").text(data.item_cost);
    $("#detailModal .modal-body #reason").text(data.reason);
    $("#detailModal .modal-footer #currency").text(data.currency);
    if (data.address)
        $("#detailModal .modal-body #address").text(data.address.fullAddress);
    $("#detailModal .modal-body #type").text(data.type);
    $("#detailModal .modal-body #category").text(data.category);
    $("#detailModal .modal-body #monthly").text(data.monthly);
    $("#detailModal .modal-body #promotion-true").hide();
    $("#detailModal .modal-body #promotion-false").hide();
    $("#detailModal .modal-body #promotion").removeClass("fa fa-check fa-close").addClass((data.promotion) ? "fa fa-check" : "fa fa-close");
    $("#detailModal .modal-body #good_buy").removeClass("fa fa-check fa-close text-success text-danger").addClass((data.good_buy) ? "fa fa-check text-success" : "fa fa-close text-danger");
    $("#detailModal .modal-body #comments").html(data.comments ? data.comments : "<i class='text-muted'>No comments</i>");
    $("#detailModal .modal-footer #totalItemCost").text(data.totalItemCost);
    $("#detailModal").modal({
        keyboard: true
    });
};

function itemUpsertCallback(data) {
    
    if (!data)
        data = {};
    $("#upsertModal .modal-body #id").val(data._id);
    $("#upsertModal .modal-body #date").val(moment(data.date).utc().format("YYYY-MM-DD"));

    $("#upsertModal .modal-body #product").val(data.product);
    if (data.brand)
        $("#upsertModal .modal-body #brand").val(data.brand._id);
    $("#upsertModal .modal-body #upp").val(data.upp);
    $("#upsertModal .modal-body #weight").val(data.weight);
    if (data.unit)
        $("#upsertModal .modal-body #unit").val(data.unit);
    else
        $("#upsertModal .modal-body #unit").val($("#unit option:first").val());

    $('select#unit[name=selValue]').val(1);
    $("#upsertModal .modal-body #units_bought").val(data.units_bought);
    $("#upsertModal .modal-body #unit_cost").val(data.unit_cost);
    $("#upsertModal .modal-body #item_cost").val(data.item_cost);
    if (data.reason)
        $("#upsertModal .modal-body #reason").val(data.reason);
    else
        $("#upsertModal .modal-body #reason").val($("#reason option:first").val());

    console.log($("#upsertModal .modal-body #reason").val());

    if (data.category)
        $("#upsertModal .modal-body #category").val(data.category);
    else
        $("#upsertModal .modal-body #category").val($("#category option:first").val());
    $("#upsertModal .modal-body #currency").val(data.currency);
    $('select#currency[name=selValue]').val(1);
    $("#upsertModal .modal-body #monthly").val(data.monthly);
    if (data.address)
        $("#upsertModal .modal-body #address").val(data.address._id);
    if (data.type)
        $("#upsertModal .modal-body #type").val(data.type);
    else
        $("#upsertModal .modal-body #type").val($("#type option:first").val());
    $("#upsertModal .modal-body #promotion").prop('checked', data.promotion);
    $("#upsertModal .modal-body #good_buy").prop('checked', data.good_buy);
    $("#upsertModal .modal-body #comments").val(data.comments);
    $('.selectpicker').selectpicker('refresh')
    $("#upsertModal").modal({
        keyboard: true
    });
};


function itemRowUpsertCallback(data) {
    if (_.isString(data)) {
        window.location.reload(true);
    }
    row = $("#modal-row-container tr#" + data._id);
    row.find("#status i").addClass(data.status);
    if (data.date)
        row.find("#date").text(moment(data.date).utc().format("YYYY-MM-DD"));
    row.find("td#product").text(data.product);

    if (data.brand)
        row.find("#brand").text(data.brand.name);
    if (data.address)
        row.find("#address").text(data.address.fullAddress);

    row.find("#weight").text(data.weight);
    row.find("#unit").text(data.unit);
    row.find("#upp").text(data.upp);
    row.find("#reason").text(data.reason);
    row.find("#units_bought").text(data.units_bought);
    row.find("#unit_cost").text(data.unit_cost);
    row.find("#item_cost").text(data.item_cost);
    row.find("#totalItemCost").text(data.totalItemCost);
    row.find("#totalItemCost").text(data.totalItemCost);
    row.find("#type").text(data.type);
    row.find("#category").text(data.category);
    row.find("#currency").text(data.currency);
    row.find("#promotion").text(data.promotion);
    row.find("#good_buy").text(data.good_buy);
    row.find("#comments").text(data.comments);
}

function initItemListCallbacks() {
    $("a#del-link").on("click", itemDeleteCallback);

    $("a.add-link").on('click', function(e) {
        e.preventDefault();
        itemUpsertCallback();
        $("#upsertModal").modal({
            keyboard: true
        });
    });

    $("button.pay-link").on('click', function(e) {
        e.preventDefault();
        var monthly = $(e.target).data("id");
        itemUpsertCallback({ product: monthly, monthly: monthly });
        $("#upsertModal").modal({
            keyboard: true
        });
    });

    $("a.update-link").on('click', function(e) {
        e.preventDefault();
        var url = "/items/detail/" + $(e.target).parent().data("id");

        $.get(
            url, null,
            itemUpsertCallback
        );
    });

    $("#modal-row-container td:not(#actions)").on('click', function(e) {
        // alert($(e.target).parent().attr("id"));
        $.ajax({
            url: "/items/detail/" + $(e.target).parent().attr("id"),
            method: "GET",
            success: itemDetailCallback
        });
    });


    $("#upsertModal button#upsert").on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: "/items/update/",
            data: $('#upsertModal form').serialize(),
            method: "POST",
            success: itemRowUpsertCallback
        });
    });
}
//----------------------------------
//charts
//----------------------------------
function pieChart(card, data, cur) {
    var dataset = _.map(data, (e) => e.total);
    var labels = _.map(data, (e) => e._id.value);
    //   $("#debug").text( dataset);
    new Chart($("#" + card), {
        type: 'pie',
        data: {
            datasets: [{
                data: dataset,
                backgroundColor: randomColor({
                    count: dataset.length,
                    //red, orange, yellow, green, blue, purple, pink and monochrom
                    hue: 'random',
                    //to always return the same colors
                    seed: card,
                    //bright, light or dark.
                    luminosity: 'dark'
                })
            }],
            labels: labels
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function barChart(card, data, cur, max) {

    var step = parseInt(Math.max(10, max / (max / 500)));

    var dataset = _.map(data, (e) => e.total);
    var labels = _.map(data, (e) => e._id.value);
    //   $("#debug").text( dataset);
    new Chart($("#" + card), {
        type: 'bar',
        data: {
            datasets: [{
                data: dataset,
                backgroundColor: "green"
            }],
            labels: labels
        },
        options: {
            legend: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        stepSize: step,
                    }
                }]
            }
        }
    });
}


function dohBarChart(card, data, cur,dataset,labels) {
        new Chart($("#" + card), {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: dataset,
                    backgroundColor: randomColor({
                        count: dataset.length,
                        //red, orange, yellow, green, blue, purple, pink and monochrom
                        hue: 'random',
                        //to always return the same colors
                        seed: card,
                        //bright, light or dark.
                        luminosity: 'dark'
                    })
                }],
                labels: labels
            },
            options: {
                legend: false,
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function hBarChartAddress(card, data, cur) {
        console.log( data);
        
        var dataset = _.map(data, (e) => e.total);
        var labels = _.map(data, (e) => e._id.value[0].name);
        dohBarChart(card, data, cur,dataset,labels);
    }

    function hBarChartItems(card, data, cur) {
        var dataset = _.map(data, (e) => Number(e.totalItemCost));
        var labels = _.map(data, (e) => e.product);
        dohBarChart(card, data, cur,dataset,labels);
    }
//----------------------------------
//----------------------------------