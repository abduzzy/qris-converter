<script setup lang="ts">
const { qris: selectedQris } = useQris();

const transactionAmountExample = computed(() => {
  if (!selectedQris.value) {
    return 25000;
  }

  return selectedQris.value.getTransactionAmount() ?? 25000;
});

const encodedQris = computed(() => {
  if (!selectedQris.value) {
    return "";
  }

  return btoa(selectedQris.value.serialize());
});
</script>

<template>
  <CardSection title="API">
    <article
      class="prose prose-neutral prose-sm dark:prose-invert prose-h3:text-base"
    >
      <p>Terdapat 3 cara untuk mengakses API:</p>
      <ol>
        <li>
          <p>
            Default
            <code class="mr-2"
              >/api/qris/[encoded qris]?transaction-amount=[nominal
              transaksi]</code
            >
          </p>
          <p>
            Output dalam bentuk gambar QRIS lengkap dengan nama merchant, NMID,
            dan nominal transaksi.
          </p>
        </li>

        <li>
          <p>
            Hanya QRIS
            <code
              >/api/qris/[encoded qris]/qris-only?transaction-amount=[nominal
              transaksi]</code
            >
          </p>
          <p>Output dalam bentuk gambar QRIS saja.</p>
        </li>

        <li>
          <p>
            Raw
            <code
              >/api/qris/[encoded qris]/raw?transaction-amount=[nominal
              transaksi]</code
            >
          </p>
          <p>
            Output dalam bentuk text, harus dilakukan konversi sendiri untuk
            menjadi gambar QRIS (gunakan QR generator mode teks).
          </p>
        </li>
      </ol>

      <h3>Cara Encode QRIS</h3>
      <p>
        Untuk mengakses API QRIS Converter, kode QRIS harus dienkripsi terlebih
        dahulu ke <code>base64</code>.
      </p>
      <p>
        Kode QRIS bisa diketahui dengan cara men-scan QRIS statis menggunakan
        aplikasi QR reader.
      </p>

      <h3>Contoh</h3>
      <UAlert
        v-if="!selectedQris"
        title="Scan kode QRIS terlebih dahulu untuh melihat contoh"
        color="warning"
        variant="subtle"
      />
      <template v-else>
        <p>
          Sebagai contoh, pada hasil scan QRIS
          <strong>{{ selectedQris?.getMerchantName() }}</strong
          >, didapat kode QRIS berikut ini:
        </p>
        <code class="break-all">{{ selectedQris.serialize() }}</code>

        <p>enkripsi kode QRIS tersebut ke <code>base64</code>:</p>
        <code class="break-all">{{ encodedQris }}</code>
        <p>
          Sehingga API bisa diakses dengan tautan berikut ini (dengan contoh
          nominal transaksi {{ currencyFormatter(transactionAmountExample) }}):
        </p>
        <p>
          <code class="break-all"
            >/api/qris/{{ encodedQris }}/raw?transaction-amount={{
              transactionAmountExample
            }}</code
          >
        </p>
        <p>Atau</p>
        <p>
          <code class="break-all"
            >/api/qris/{{ encodedQris }}/qris-only?transaction-amount={{
              transactionAmountExample
            }}</code
          >
        </p>
      </template>
    </article>
  </CardSection>
</template>
