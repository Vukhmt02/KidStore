export const categories = [
  {
    id: "baby",
    name: "Bé sơ sinh",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
    color: "bg-peach"
  },
  {
    id: "girls",
    name: "Bé gái",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
    color: "bg-skysoft"
  },
  {
    id: "boys",
    name: "Bé trai",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
    color: "bg-mint"
  },
  {
    id: "accessories",
    name: "Phụ kiện",
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    color: "bg-lemon"
  }
];

export const products = [
  {
    id: 1,
    name: "Áo thun cầu vồng pastel",
    price: 189000,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
    ],
    category: "girls",
    sizes: ["2Y", "3Y", "4Y", "5Y"],
    colors: ["Hồng", "Kem", "Xanh"],
    description: "Áo thun cotton mềm, thoáng khí, phù hợp mặc đi học hoặc đi chơi cuối tuần.",
    badge: "Mới"
  },
  {
    id: 2,
    name: "Set yếm denim mềm",
    price: 329000,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80"
    ],
    category: "baby",
    sizes: ["6M", "9M", "12M", "18M"],
    colors: ["Xanh denim", "Be"],
    description: "Set yếm denim nhẹ, có lớp lót mềm mại và khóa bấm tiện thay đồ.",
    badge: "Bán chạy"
  },
  {
    id: 3,
    name: "Váy hoa mùa hè",
    price: 279000,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
    ],
    category: "girls",
    sizes: ["3Y", "4Y", "5Y", "6Y"],
    colors: ["Hồng hoa", "Vàng nhạt"],
    description: "Váy cotton dáng xòe, họa tiết hoa nhẹ nhàng, dễ phối sandal và mũ cói.",
    badge: "Sale"
  },
  {
    id: 4,
    name: "Áo polo khủng long",
    price: 219000,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80"
    ],
    category: "boys",
    sizes: ["2Y", "3Y", "4Y", "6Y"],
    colors: ["Xanh lá", "Trắng"],
    description: "Áo polo co giãn nhẹ, cổ đứng gọn gàng, họa tiết vui mắt cho bé năng động.",
    badge: "Hot"
  },
  {
    id: 5,
    name: "Bộ ngủ mây trắng",
    price: 249000,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"
    ],
    category: "baby",
    sizes: ["9M", "12M", "18M", "24M"],
    colors: ["Trắng", "Xanh nhạt"],
    description: "Bộ ngủ chất modal mịn, đường may phẳng, giữ cảm giác dễ chịu cả đêm.",
    badge: "Mới"
  },
  {
    id: 6,
    name: "Mũ tai thỏ cotton",
    price: 99000,
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80"
    ],
    category: "accessories",
    sizes: ["S", "M", "L"],
    colors: ["Kem", "Hồng", "Nâu"],
    description: "Mũ cotton mềm ôm nhẹ, che nắng tốt và tạo điểm nhấn đáng yêu cho outfit.",
    badge: "Bán chạy"
  },
  {
    id: 7,
    name: "Quần short linen bé trai",
    price: 179000,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"
    ],
    category: "boys",
    sizes: ["3Y", "4Y", "5Y", "7Y"],
    colors: ["Be", "Xanh navy"],
    description: "Quần short linen pha cotton, cạp chun mềm, tiện vận động ngoài trời.",
    badge: "Sale"
  },
  {
    id: 8,
    name: "Áo khoác cardigan kẹo bông",
    price: 359000,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80"
    ],
    category: "girls",
    sizes: ["2Y", "3Y", "4Y", "5Y", "6Y"],
    colors: ["Hồng", "Tím nhạt", "Kem"],
    description: "Cardigan len dệt mềm, vừa đủ ấm cho ngày se lạnh, form rộng dễ mặc.",
    badge: "Mới"
  }
];

export const getProductById = (id) => products.find((product) => product.id === Number(id));
