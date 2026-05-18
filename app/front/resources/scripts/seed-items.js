"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var API_URL = "http://localhost:8081/items/new";
var baseItems = [
    {
        name: "Classic Burger",
        description: "Beef patty, cheese, lettuce, tomato, and house sauce.",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        price: 8.5,
        discount: 0,
    },
    {
        name: "Cheese Burger",
        description: "Juicy beef burger with melted cheddar and pickles.",
        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        price: 9,
        discount: 0,
    },
    {
        name: "Chicken Burger",
        description: "Crispy chicken fillet with lettuce and garlic sauce.",
        img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800",
        price: 8.9,
        discount: 0,
    },
    {
        name: "Margherita Pizza",
        description: "Tomato sauce, mozzarella, basil, and olive oil.",
        img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
        price: 10,
        discount: 0,
    },
    {
        name: "Pepperoni Pizza",
        description: "Mozzarella, tomato sauce, and spicy pepperoni.",
        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
        price: 11.5,
        discount: 0,
    },
    {
        name: "Chicken Tacos",
        description: "Grilled chicken, fries, cheese sauce, and tortillas.",
        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
        price: 9.5,
        discount: 0,
    },
    {
        name: "Beef Tacos",
        description: "Seasoned beef, melted cheese, fries, and spicy sauce.",
        img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
        price: 10.5,
        discount: 0,
    },
    {
        name: "Chicken Wrap",
        description: "Chicken strips, salad, tomatoes, and creamy sauce.",
        img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
        price: 7.9,
        discount: 0,
    },
    {
        name: "Caesar Salad",
        description: "Romaine lettuce, chicken, parmesan, croutons, and Caesar sauce.",
        img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
        price: 8,
        discount: 0,
    },
    {
        name: "Pasta Carbonara",
        description: "Creamy pasta with parmesan, turkey bacon, and black pepper.",
        img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
        price: 11,
        discount: 0,
    },
];
var variants = [
    { prefix: "", priceAdd: 0, discount: 0 },
    { prefix: "Spicy", priceAdd: 0.7, discount: 0 },
    { prefix: "Double", priceAdd: 2.5, discount: 0 },
    { prefix: "Special", priceAdd: 1.5, discount: 10 },
    { prefix: "XL", priceAdd: 3, discount: 5 },
    { prefix: "Premium", priceAdd: 4, discount: 0 },
    { prefix: "Chef's", priceAdd: 2, discount: 15 },
    { prefix: "Family", priceAdd: 5, discount: 10 },
    { prefix: "Loaded", priceAdd: 2.2, discount: 0 },
    { prefix: "House", priceAdd: 1, discount: 5 },
];
var items = baseItems.flatMap(function (item) {
    return variants.map(function (variant) { return (__assign(__assign({}, item), { name: variant.prefix ? "".concat(variant.prefix, " ").concat(item.name) : item.name, price: Number((item.price + variant.priceAdd).toFixed(2)), discount: variant.discount })); });
});
function seedMenu() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, items_1, item, response, _a, _b, _c, created;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("Seeding ".concat(items.length, " menu items..."));
                    _i = 0, items_1 = items;
                    _d.label = 1;
                case 1:
                    if (!(_i < items_1.length)) return [3 /*break*/, 7];
                    item = items_1[_i];
                    return [4 /*yield*/, fetch(API_URL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(item),
                        })];
                case 2:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    _b = (_a = console).error;
                    _c = ["Failed to create ".concat(item.name, ":")];
                    return [4 /*yield*/, response.text()];
                case 3:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    created = _d.sent();
                    console.log("Created: ".concat(created.name));
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("Done.");
                    return [2 /*return*/];
            }
        });
    });
}
seedMenu();
