
$(document).ready(() => {
  $('#myTable').DataTable();
});
// edit data
$('.update').click(function () {
  var id = this.id;
  $.ajax({
    type: 'POST',
    url: 'admin/find_by_id',
    data: { "id": id },
    success: (data) => {
      $("#update_id").attr("value", data._id);
      $("#update_title").attr("value", data.title);
      $("#update_description").attr("value", data.description);
      $("#update_url").attr("value", data.url);
      $("#update_imageUrl").attr("value", data.imageUrl);
      $("#update_published").attr("value", data.published);
      $('#Modal').modal({ show: true });
    },
    error: () => {
      alert('No data');
      $('#Modal').modal({ show: false });
    }
  });
});

// update data
$(() => {
  $('#update_table').on('click', (e) => {
    var data = $('#update_news').serialize();
    e.preventDefault();
    $.ajax({
      url: 'admin/update_by_id',
      type: 'PUT',
      data: data,
      success: (data) => {
        window.location.reload()
      },
      error: () => {
        alert('No data');
      }
    });
  });
});