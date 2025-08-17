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

    // Add active class for client navigation
    const navElement = $("#navbarCollapse");
    const currentUrl = window.location.pathname;
    navElement.find("a.nav-link").each(function () {
      const link = $(this); // Get the current link in the loop
      const href = link.attr("href"); // Get the href attribute of the link

      if (href === currentUrl) {
        link.addClass("active"); // Add 'active' class if the href matches the current URL
      } else {
        link.removeClass("active"); // Remove 'active' class if the href does not match
      }
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

    var index = input.data("cart-detail-index");
    var formInput = $(`input[name="cartDetails[${index}][quantity]"]`);
    if (formInput.length > 0) {
      formInput.val(newVal);
    }

    const elDetail = document.getElementById(`quantityDetail`);
    if (elDetail) {
      $(elDetail).val(newVal);
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

  // Fixed version of the filter handler
  $("#btnFilter").click(function (event) {
    event.preventDefault();
    let factoryArr = [];
    let targetArr = [];
    let priceArr = [];

    // factory
    $("#factoryFilter .form-check-input:checked").each(function () {
      factoryArr.push($(this).val());
    });

    // target
    $("#targetFilter .form-check-input:checked").each(function () {
      targetArr.push($(this).val());
    });

    // price
    $("#priceFilter .form-check-input:checked").each(function () {
      priceArr.push($(this).val());
    });

    // sort order - FIX: Missing quotes around radio-sort
    let sortValue = $('input[name="radio-sort"]:checked').val();

    // FIX: Correct URL constructor (capital U)
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams; // FIX: Add const

    const currentPage = searchParams?.get("page") ?? 1;

    // add or update query parameters
    searchParams.set("page", currentPage);
    if (sortValue) {
      searchParams.set("sort", sortValue);
    }

    // reset
    searchParams.delete("factory");
    searchParams.delete("target");
    searchParams.delete("price");

    // FIX: Correct parameter names for target and price
    if (factoryArr.length > 0) {
      searchParams.set("factory", factoryArr.join(","));
    }
    if (targetArr.length > 0) {
      searchParams.set("target", targetArr.join(","));
    }
    if (priceArr.length > 0) {
      searchParams.set("price", priceArr.join(","));
    }

    // update URL and reload the page
    window.location.href = currentUrl.toString();
  });

  // Fixed version of auto checkbox handler
  $(document).ready(function () {
    // parse URL parameters
    const params = new URLSearchParams(window.location.search);

    // set checkbox for 'factory'
    if (params.has("factory")) {
      const factories = params.get("factory").split(",");
      factories.forEach((factory) => {
        $(`#factoryFilter .form-check-input[value="${factory}"]`).prop(
          "checked",
          true
        );
      });
    }

    // set checkbox for 'target'
    if (params.has("target")) {
      const targets = params.get("target").split(",");
      targets.forEach((target) => {
        $(`#targetFilter .form-check-input[value="${target}"]`).prop(
          "checked",
          true
        );
      });
    }

    // set checkbox for 'price'
    if (params.has("price")) {
      const prices = params.get("price").split(",");
      prices.forEach((price) => {
        $(`#priceFilter .form-check-input[value="${price}"]`).prop(
          "checked",
          true
        );
      });
    }

    // set radio button for 'sort'
    if (params.has("sort")) {
      const sort = params.get("sort");
      $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop(
        "checked",
        true
      );
    }
  });

  // Custom toast functions
  function showSuccessToast(message, heading = "🎉 Thành công!") {
    $.toast({
      heading: heading,
      text: message,
      position: "top-right",
      icon: "success",
      hideAfter: 3000,
      stack: 3,
    });
  }

  function showErrorToast(message, heading = "❌ Lỗi thao tác") {
    $.toast({
      heading: heading,
      text: message,
      position: "top-right",
      icon: "error",
      hideAfter: 4000,
      stack: false,
    });
  }

  function showCartToast(productName, cartCount) {
    const message = productName
      ? `Đã thêm "${productName}" vào giỏ hàng. Bạn có ${cartCount} sản phẩm.`
      : `Thêm sản phẩm vào giỏ hàng thành công. Bạn có ${cartCount} sản phẩm.`;

    $.toast({
      heading: "🛒 Giỏ hàng",
      text: message,
      position: "top-right",
      icon: "success",
      hideAfter: 4000,
      stack: 3,
    });
  }

  function showLoginErrorToast() {
    $.toast({
      heading: "🔐 Yêu cầu đăng nhập",
      text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      position: "top-right",
      icon: "error",
      hideAfter: 4000,
      stack: false,
    });
  }

  // handle add to cart with ajax - Updated with custom toast
  $(".btnAddToCartHomePage").click(function (event) {
    event.preventDefault();

    if (!isLogin()) {
      showLoginErrorToast();
      return;
    }

    const productId = $(this).attr("data-product-id");
    const productName = $(this).closest(".fruite-item").find("h4 a").text();

    $.ajax({
      url: `${window.location.origin}/api/add-product-to-cart`,
      type: "POST",
      data: JSON.stringify({ quantity: 1, productId: productId }),
      contentType: "application/json",

      success: function (response) {
        const sum = +response.data;

        // update cart
        $("#sumCart").text(sum);

        // show custom toast
        showCartToast(productName, sum);
      },
      error: function (response) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại sau");
        console.log("error: ", response);
      },
    });
  });

  $(".btnAddToCartDetailPage").click(function (event) {
    event.preventDefault();

    if (!isLogin()) {
      showLoginErrorToast();
      return;
    }

    const productId = $(this).attr("data-product-id");
    const quantity = $("#quantityDetail").val();
    const productName = $("h4.fw-bold").first().text();

    $.ajax({
      url: `${window.location.origin}/api/add-product-to-cart`,
      type: "POST",
      data: JSON.stringify({ quantity: quantity, productId: productId }),
      contentType: "application/json",

      success: function (response) {
        const sum = +response.data;

        // update cart
        $("#sumCart").text(sum);

        // show custom toast
        showCartToast(productName, sum);
      },
      error: function (response) {
        showErrorToast("Có lỗi xảy ra, vui lòng thử lại sau");
        console.log("error: ", response);
      },
    });
  });

  function isLogin() {
    const navElement = $("#navbarCollapse");
    const childLogin = navElement.find("a.a-login");
    if (childLogin.length > 0) {
      return false;
    }
    return true;
  }

  // Make custom toast functions available globally
  window.showSuccessToast = showSuccessToast;
  window.showErrorToast = showErrorToast;
  window.showCartToast = showCartToast;
  window.showLoginErrorToast = showLoginErrorToast;
})(jQuery);
