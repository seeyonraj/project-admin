$('.delete').click(function () {
    var response = confirm("do you want to delete")
    const id = this.id;
    if (response === true) {
        $.ajax({
            type: 'DELETE',
            url: 'admin/delete_by_id',
            method: 'delete',
            data: { id },
            success: (data) => {
                console.log('data is ' + JSON.stringify(data));
                window.location.reload()
            },
            error: () => {
                alert('No data');
            }
        });
    }
    else {
        console.log("not deleted")
    }
});