# ==========================================
# Stage 1: Builder
# Membangun aplikasi Nuxt (Vue)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install semua dependensi
RUN npm install

# Copy seluruh source code ke dalam container
COPY . .

# Build aplikasi Nuxt
# Proses ini akan menghasilkan folder ".output" yang berisi server siap jalan
RUN npm run build

# ==========================================
# Stage 2: Production
# Image super ringan, hanya berisi hasil build tanpa source code asli / node_modules development
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Di Nuxt versi 3+, KITA HANYA BUTUH MENG-COPY FOLDER ".output"
# Ini membuat image Docker menjadi sangat kecil dan sangat efisien!
COPY --from=builder /app/.output ./.output

# Ubah ownership agar berjalan sebagai user non-root (untuk keamanan tambahan)
# Ini langkah optional namun sangat direkomendasikan
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000

# Perintah untuk menjalankan server production Nuxt
CMD ["node", ".output/server/index.mjs"]
