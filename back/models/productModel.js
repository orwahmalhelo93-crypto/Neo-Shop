import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			required: true,
		},

		price: {
			type: Number,
			required: true,
			min: 0,
		},

		image: {
			type: String,
			required: true,
		},

		category: {
			type: String,
			required: true,
		},

		// Sale status
		isOnSale: {
			type: Boolean,
			default: false,
		},

		// Discount percentage
		discountPercentage: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},

		// Sale start date
		saleStartDate: {
			type: Date,
			default: null,
		},

		// Sale end date
		saleEndDate: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Validate sale information
productSchema.pre("validate", function () {
	if (!this.isOnSale) {
		this.discountPercentage = 0;
		this.saleStartDate = null;
		this.saleEndDate = null;
		return;
	}

	if (this.discountPercentage <= 0) {
		this.invalidate(
			"discountPercentage",
			"Discount percentage must be greater than 0.",
		);
	}

	if (!this.saleStartDate) {
		this.invalidate("saleStartDate", "Sale start date is required.");
	}

	if (!this.saleEndDate) {
		this.invalidate("saleEndDate", "Sale end date is required.");
	}

	if (
		this.saleStartDate &&
		this.saleEndDate &&
		this.saleStartDate >= this.saleEndDate
	) {
		this.invalidate(
			"saleEndDate",
			"Sale end date must be after sale start date.",
		);
	}
});

// Calculate sale status automatically
productSchema.virtual("saleStatus").get(function () {
	if (!this.isOnSale) {
		return "inactive";
	}

	const now = new Date();

	if (now < this.saleStartDate) {
		return "scheduled";
	}

	if (now >= this.saleEndDate) {
		return "expired";
	}

	return "active";
});

// Check whether the sale is currently active
productSchema.virtual("isSaleActive").get(function () {
	return this.saleStatus === "active";
});

// Calculate discounted price automatically
productSchema.virtual("discountedPrice").get(function () {
	if (!this.isSaleActive) {
		return this.price;
	}

	return Number((this.price * (1 - this.discountPercentage / 100)).toFixed(2));
});

// Create Product Model
const productModel =
	mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
