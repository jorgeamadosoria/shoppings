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
        $("#detailModal .modal-body #unit_cost").text(data.unit_cost);
    }
    $("#detailModal .modal-body #units_bought").text(data.units_bought);
    $("#detailModal .modal-body #item_cost").text(data.item_cost);
    $("#detailModal .modal-body #reason").text(data.reason);
    $("#detailModal .modal-footer #currency").text(data.currency);
    if (data.address)
        $("#detailModal .modal-body #address").text(data.address.fullAddress);
    $("#detailModal .modal-body #type").text(data.type);
    $("#detailModal .modal-body #category").text(data.category);
    $("#detailModal .modal-body #promotion-true").hide();
    $("#detailModal .modal-body #promotion-false").hide();
    $("#detailModal .modal-body #promotion").removeClass("fa fa-check fa-close").addClass((data.promotion) ? "fa fa-check" : "fa fa-close");
    $("#detailModal .modal-body #good_buy").removeClass("fa fa-check fa-close text-success text-danger").addClass((data.good_buy) ? "fa fa-check text-success" : "fa fa-close text-danger");
    $("#detailModal .modal-body #comments").html(data.comments ? data.comments : "<i class='text-muted'>No comments</i>");
    $("#detailModal .modal-footer #totalItemCost").text(data.totalItemCost);
    $("#detailModal").modal({ keyboard: true });
};

function itemUpsertCallback(data) {
    if (!data)
        data = {};
    $("#upsertModal .modal-body #id").val(data.id);
    $("#upsertModal .modal-body #date").val(moment(data.date).utc().format("YYYY-MM-DD"));
    $("#upsertModal .modal-body #product").val(data.product);
    if (data.brand)
        $("#upsertModal .modal-body #brand").val(data.brand._id);
    $("#upsertModal .modal-body #upp").val(data.upp);
    $("#upsertModal .modal-body #weight").val(data.weight);
    $("#upsertModal .modal-body #unit").val(data.unit);
    $('select#unit[name=selValue]').val(1);
    $("#upsertModal .modal-body #units_bought").val(data.units_bought);
    $("#upsertModal .modal-body #unit_cost").val(data.unit_cost);
    $("#upsertModal .modal-body #item_cost").val(data.item_cost);
    if (data.reason)
        $("#upsertModal .modal-body #reason").val(data.reason);
    else
        $("#upsertModal .modal-body #reason").val($("#reason option:first").val());
    $("#upsertModal .modal-body #currency").val(data.currency);
    $('select#currency[name=selValue]').val(1);

    if (data.address)
        $("#upsertModal .modal-body #address").val(data.address._id);
    if (data.type)
        $("#upsertModal .modal-body #type").val(data.type);
    else
        $("#upsertModal .modal-body #type").val($("#type option:first").val());
    if (data.category)
        $("#upsertModal .modal-body #category").val(data.category);
    else
        $("#upsertModal .modal-body #category").val($("#category option:first").val());

    $("#upsertModal .modal-body #promotion").prop('checked', data.promotion);
    $("#upsertModal .modal-body #good_buy").prop('checked', data.good_buy);
    $("#upsertModal .modal-body #comments").val(data.comments);
    $('.selectpicker').selectpicker('refresh')
    $("#upsertModal").modal({ keyboard: true });
};