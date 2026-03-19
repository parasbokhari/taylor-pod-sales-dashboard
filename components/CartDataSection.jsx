"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Package,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Change this if the product guide URL prefix ever changes
const PRODUCT_BASE_URL = "https://taylor.com/product-guide/";

function getAttributeKeys(variants) {
  const keys = new Set();
  variants.forEach((v) => {
    Object.keys(v.attributes ?? {}).forEach((k) => keys.add(k));
  });
  return Array.from(keys);
}

function ProductRow({ product }) {
  const [open, setOpen] = useState(false);
  const attrKeys = getAttributeKeys(product.variants ?? []);
  const hasImage = !!product.image_url;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Product header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {/* Product image or fallback icon */}
          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            {hasImage ? (
              <Image
                src={product.image_url}
                alt={product.product_name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <Package className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {product.product_name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-muted-foreground font-mono">
                {product.product_slug}
              </p>
              <a
                href={`${PRODUCT_BASE_URL}${product.product_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Badge variant="secondary" className="tabular-nums">
            {product.sku_count} SKU{product.sku_count !== 1 ? "s" : ""}
          </Badge>
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Variants table */}
      {open && (
        <div className="border-t border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-medium">SKU</TableHead>
                {attrKeys.map((k) => (
                  <TableHead key={k} className="text-xs font-medium">
                    {k}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(product.variants ?? []).map((variant) => (
                <TableRow key={variant.sku} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs font-medium">
                    {variant.sku}
                  </TableCell>
                  {attrKeys.map((k) => (
                    <TableCell
                      key={k}
                      className="text-xs text-muted-foreground"
                    >
                      {variant.attributes?.[k] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function CartDataSection({ cartData }) {
  if (!cartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              cart_data
            </code>{" "}
            on this submission yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  let parsed;
  try {
    parsed = typeof cartData === "string" ? JSON.parse(cartData) : cartData;
  } catch {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Failed to parse cart data — invalid JSON.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { products = [], total_skus } = parsed;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart Data
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {products.length} product{products.length !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span>{total_skus} total SKUs</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {products.map((product) => (
          <ProductRow key={product.product_slug} product={product} />
        ))}
      </CardContent>
    </Card>
  );
}
