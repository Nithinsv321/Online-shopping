$(function () {

//     /* ===============================================================
//          PRODUCT SLIDER
//       =============================================================== */
    $('.product-slider').owlCarousel({
        items: 1,
        thumbs: true,
        thumbImage: false,
        thumbsPrerendered: true,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item'
    });
//       /* ===============================================================
//            TOGGLE ALTERNATIVE BILLING ADDRESS
//         =============================================================== */
//       $('#alternateAddressCheckbox').on('change', function () {
//          var checkboxId = '#' + $(this).attr('id').replace('Checkbox', '');
//          $(checkboxId).toggleClass('d-none');
//       });


      /* ===============================================================
           DISABLE UNWORKED ANCHORS
        =============================================================== */
      $('a[href="#"]').on('click', function (e) {
         e.preventDefault();
      });

});

/* ===============================================================
     COUNTRY SELECT BOX FILLING
  =============================================================== */
$.getJSON('js/countries.json', function (data) {
    $.each(data, function (key, value) {
        var selectOption = "<option value='" + value.name + "' data-dial-code='" + value.dial_code + "'>" + value.name + "</option>";
        $("select.country").append(selectOption);
    });
})
