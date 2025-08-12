import { prisma } from "config/client";
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();
  const countProduct = await prisma.product.count();
  if (countRole === 0) {
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Admin thì full quyền",
        },
        {
          name: "USER",
          description: "User thông thường",
        },
      ],
    });
  }
  if (countUser === 0) {
    const defaultPassword = await hashPassword("123456");
    const adminRole = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });
    if (adminRole)
      await prisma.user.createMany({
        data: [
          {
            fullName: "Truong Vu ",
            username: "nguyentruongvu@gmail.com",
            password: defaultPassword,
            avatar: "e2d99270-ba69-43cd-a318-c6dfd25840e8.jpg",
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id,
          },
          {
            fullName: "Admin",
            username: "admin@gmail.com",
            password: defaultPassword,
            avatar: "e2d99270-ba69-43cd-a318-c6dfd25840e8.jpg",
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id,
          },
        ],
      });
  }
  if (countProduct === 0) {
    const products = [
      {
        name: "Asus TUF Gaming A15",
        price: 18990000,
        image: "asus-fa506nfr-r7-6753037793579.jpg",
        detailDesc:
          "Laptop gaming mạnh mẽ với chip AMD Ryzen 7, card đồ họa NVIDIA GeForce RTX 3060, RAM 16GB DDR4, ổ cứng SSD 512GB NVMe. Thiết kế bền bỉ chuẩn quân đội MIL-STD-810H, tản nhiệt hiệu quả với công nghệ Arc Flow Fans. Màn hình 15.6 inch Full HD 144Hz, bàn phím RGB có đèn nền. Hỗ trợ kết nối đa dạng với USB-C, USB 3.2, HDMI 2.0b và Ethernet. Pin 90Wh cho thời gian sử dụng lâu dài.",
        shortDesc:
          "Laptop gaming AMD Ryzen 7, RTX 3060, 16GB RAM, 512GB SSD, màn hình 144Hz",
        quantity: 100,
        sold: 0,
        factory: "ASUS",
        target: "GAMING",
      },
      {
        name: "Asus Vivobook 15",
        price: 12990000,
        image: "asus-vivobook-go-15-0436915955334.jpg",
        detailDesc:
          "Laptop sinh viên - văn phòng với thiết kế mỏng nhẹ, chip Intel Core i5 thế hệ 12, RAM 8GB DDR4, ổ cứng SSD 256GB. Màn hình 15.6 inch Full HD chống chói, webcam HD với privacy shutter. Bàn phím NumberPad 2.0 thông minh tích hợp touchpad. Hỗ trợ sạc nhanh, kết nối WiFi 6 và Bluetooth 5.0. Trọng lượng chỉ 1.7kg, pin 42Wh sử dụng cả ngày làm việc.",
        shortDesc:
          "Laptop văn phòng Intel Core i5, 8GB RAM, 256GB SSD, thiết kế mỏng nhẹ",
        quantity: 100,
        sold: 0,
        factory: "ASUS",
        target: "SINHVIEN-VANPHONG",
      },
      {
        name: "HP 240 G10",
        price: 11490000,
        image: "hp-240-g10-0202847653099.jpg",
        detailDesc:
          "Laptop doanh nhân bền bỉ với chip Intel Core i3 thế hệ 13, RAM 8GB DDR4, ổ cứng SSD 256GB. Màn hình 14 inch HD chống chói, phù hợp làm việc ngoài trời. Thiết kế chắc chắn với vỏ nhựa ABS cao cấp, bàn phím chống tràn nước. Hỗ trợ kết nối đầy đủ với USB-A, USB-C, HDMI và RJ45. Pin 41Wh, trọng lượng 1.47kg thuận tiện di chuyển. Bảo mật với TPM 2.0 và HP Security Suite.",
        shortDesc:
          "Laptop doanh nhân Intel Core i3, 8GB RAM, 256GB SSD, thiết kế bền bỉ",
        quantity: 100,
        sold: 0,
        factory: "HP",
        target: "DOANH-NHAN",
      },
      {
        name: "HP VICTUS 15",
        price: 19990000,
        image: "hp-victus-15-8467926638805.jpg",
        detailDesc:
          "Laptop gaming hiệu năng cao với chip Intel Core i7 thế hệ 12, card đồ họa NVIDIA GeForce RTX 4050, RAM 16GB DDR4, ổ cứng SSD 512GB NVMe. Màn hình 15.6 inch Full HD 144Hz với công nghệ IPS, độ sáng 300 nits. Hệ thống tản nhiệt HP Cryo Chamber với 4 khu vực thoát khí. Bàn phím RGB 4 vùng, loa Bang & Olufsen. Kết nối WiFi 6E và Bluetooth 5.2. Pin 70Wh với công nghệ sạc nhanh.",
        shortDesc:
          "Laptop gaming Intel Core i7, RTX 4050, 16GB RAM, 512GB SSD, màn hình 144Hz",
        quantity: 100,
        sold: 0,
        factory: "HP",
        target: "GAMING",
      },
      {
        name: "Dell Inspiron 15",
        price: 13990000,
        image: "dell-inspiron-15-6190440669436.jpg",
        detailDesc:
          "Laptop đa năng cho sinh viên và văn phòng với chip Intel Core i5 thế hệ 13, RAM 8GB DDR4, ổ cứng SSD 512GB. Màn hình 15.6 inch Full HD WVA với viền mỏng, webcam HD với Windows Hello. Thiết kế premium với vỏ nhôm, bàn phím có đèn nền. Hỗ trợ sạc nhanh ExpressCharge, kết nối WiFi 6 và Bluetooth 5.1. Loa stereo Waves MaxxAudio Pro, microphone kép khử tiếng ồn. Trọng lượng 1.65kg.",
        shortDesc:
          "Laptop Intel Core i5, 8GB RAM, 512GB SSD, thiết kế premium cho văn phòng",
        quantity: 100,
        sold: 0,
        factory: "DELL",
        target: "SINHVIEN-VANPHONG",
      },
      {
        name: "Dell Inspiron 14",
        price: 16990000,
        image: "dell-inspiron-14-2428581436189.jpg",
        detailDesc:
          "Laptop mỏng nhẹ cao cấp với chip Intel Core i7 thế hệ 13, RAM 16GB DDR5, ổ cứng SSD 512GB NVMe. Màn hình 14 inch 2.2K (2240x1400) IPS, độ phủ màu 100% sRGB, phù hợp thiết kế đồ họa cơ bản. Thiết kế cao cấp với vỏ nhôm anodized, trọng lượng chỉ 1.4kg. Bàn phím có đèn nền, touchpad precision lớn. Kết nối Thunderbolt 4, WiFi 6E. Pin 54Wh với sạc nhanh 65W.",
        shortDesc:
          "Laptop mỏng nhẹ Intel Core i7, 16GB DDR5, 512GB SSD, màn hình 2.2K",
        quantity: 100,
        sold: 0,
        factory: "DELL",
        target: "MONG-NHE",
      },
      {
        name: "MacBook Pro 14",
        price: 52990000,
        image: "macbook-pro-14-7342070676867.jpg",
        detailDesc:
          "Laptop chuyên nghiệp cho thiết kế đồ họa với chip Apple M3 Pro 11-core CPU, GPU 14-core, RAM 18GB Unified Memory, ổ cứng SSD 512GB. Màn hình Liquid Retina XDR 14.2 inch (3024x1964), độ sáng 1600 nits, hỗ trợ HDR và P3 wide color gamut. Hệ thống tản nhiệt thông minh, hoạt động êm ái. Bàn phím Magic Keyboard với Touch ID, trackpad Force Touch lớn. Kết nối 3x Thunderbolt 4, HDMI, thẻ SDXC. Pin 70Wh sử dụng lên đến 18 giờ.",
        shortDesc:
          "MacBook Pro M3 Pro, 18GB RAM, 512GB SSD, màn hình XDR cho thiết kế chuyên nghiệp",
        quantity: 100,
        sold: 0,
        factory: "APPLE",
        target: "THIET-KE-DO-HOA",
      },
      {
        name: "MacBook Air 15",
        price: 34990000,
        image: "macbook-air-15-9241960644881.jpg",
        detailDesc:
          "Laptop mỏng nhẹ cao cấp với chip Apple M2 8-core CPU, GPU 10-core, RAM 8GB Unified Memory, ổ cứng SSD 256GB. Màn hình Liquid Retina 15.3 inch (2880x1864), độ sáng 500 nits, hỗ trợ 1 tỷ màu. Thiết kế siêu mỏng 11.5mm, trọng lượng chỉ 1.51kg. Không quạt tản nhiệt, hoạt động hoàn toàn im lặng. Bàn phím Magic Keyboard với Touch ID, 4 loa stereo hỗ trợ Spatial Audio. Kết nối 2x Thunderbolt, MagSafe 3. Pin 66.5Wh lên đến 18 giờ sử dụng.",
        shortDesc:
          "MacBook Air M2, 8GB RAM, 256GB SSD, 15.3 inch siêu mỏng nhẹ",
        quantity: 100,
        sold: 0,
        factory: "APPLE",
        target: "MONG-NHE",
      },
      {
        name: "Acer Nitro V",
        price: 16990000,
        image: "acer-nitro-v-15-0659550806835.jpg",
        detailDesc:
          "Laptop gaming tầm trung với chip AMD Ryzen 5 7535HS, card đồ họa NVIDIA GeForce RTX 4050, RAM 8GB DDR5, ổ cứng SSD 512GB NVMe. Màn hình 15.6 inch Full HD 144Hz IPS, độ sáng 300 nits. Hệ thống tản nhiệt Acer CoolBoost với 2 quạt và 4 ống đồng. Bàn phím RGB 4 vùng với WASD nổi bật. Kết nối WiFi 6, Bluetooth 5.1, đầy đủ cổng USB, HDMI 2.1. Pin 57.5Wh, trọng lượng 2.1kg.",
        shortDesc:
          "Laptop gaming AMD Ryzen 5, RTX 4050, 8GB DDR5, 512GB SSD, màn hình 144Hz",
        quantity: 100,
        sold: 0,
        factory: "ACER",
        target: "GAMING",
      },
      {
        name: "Acer Gaming Nitro V",
        price: 21990000,
        image: "acer-nitro-v-anv15-2134823782311.jpg",
        detailDesc:
          "Laptop gaming cao cấp với chip Intel Core i7-13620H, card đồ họa NVIDIA GeForce RTX 4060, RAM 16GB DDR5, ổ cứng SSD 1TB NVMe. Màn hình 15.6 inch Full HD 165Hz IPS với AMD FreeSync Premium, độ sáng 350 nits. Hệ thống tản nhiệt nâng cấp với 3 quạt và 5 ống đồng. Bàn phím RGB per-key với switch mechanical. Audio DTS:X Ultra surround sound. Kết nối WiFi 6E, Thunderbolt 4. Pin 59Wh với sạc nhanh 135W.",
        shortDesc:
          "Laptop gaming cao cấp Intel Core i7, RTX 4060, 16GB DDR5, 1TB SSD, màn hình 165Hz",
        quantity: 100,
        sold: 0,
        factory: "ACER",
        target: "GAMING",
      },
    ];

    await prisma.product.createMany({
      data: products,
    });
  }
  if (countRole !== 0 && countUser !== 0 && countProduct !== 0) {
    console.log(">>> ALREADY INIT DATA");
  }
};
export default initDatabase;
