(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow");
      } else {
        $(".fixed-top").removeClass("shadow");
      }
    } else {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow").css("top", -55);
      } else {
        $(".fixed-top").removeClass("shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonial carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });

  // vegetable carousel
  $(".vegetable-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Product Quantity
  $(".quantity button").on("click", function () {
    var button = $(this);
    var input = button.parent().parent().find("input");
    var oldValue = parseFloat(input.val());
    var newVal;

    if (button.hasClass("btn-plus")) {
      newVal = oldValue + 1;
    } else {
      if (oldValue > 1) {
        newVal = oldValue - 1;
      } else {
        newVal = 1;
      }
    }

    input.val(newVal);

    var cartDetailId = input.data("cart-detail-id");
    var cartDetailPrice = parseFloat(input.data("cart-detail-price"));

    var newItemTotal = newVal * cartDetailPrice;

    $('p[data-cart-detail-id="' + cartDetailId + '"]').text(
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(newItemTotal)
    );

    // Cập nhật form input - Cách sửa đúng
    var index = input.data("cart-detail-index");
    var formInput = $(`input[name="cartDetails[${index}][quantity]"]`);
    if (formInput.length > 0) {
      formInput.val(newVal);
    }

    updateCartTotal();
  });

  function updateCartTotal() {
    var totalPrice = 0;

    $(".quantity input").each(function () {
      var quantity = parseFloat($(this).val());
      var price = parseFloat($(this).data("cart-detail-price"));
      totalPrice += quantity * price;
    });

    $("[data-cart-total-price]").each(function () {
      $(this).attr("data-cart-total-price", totalPrice);
      $(this).text(
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalPrice)
      );
    });
  }
})(jQuery);
