<template>
  <div class="shop-page">
    <van-nav-bar title="积分商城" left-arrow @click-left="router.back()" fixed placeholder />
    <div class="content">
      <div class="points-balance">
        <span>当前积分：{{ userStore.profile?.current_points || 0 }}</span>
      </div>
      <van-grid :column-num="2" :gutter="10">
        <van-grid-item v-for="item in items" :key="item.id" @click="showItemDetail(item)">
          <template #icon>
            <div class="shop-item">
              <div class="item-icon">{{ item.icon_url || '🎁' }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-cost">{{ item.cost }}积分</div>
            </div>
          </template>
        </van-grid-item>
      </van-grid>
      <van-dialog v-model:show="showDialog" :title="selectedItem?.name" show-cancel-button @confirm="redeemItem">
        <p>{{ selectedItem?.description }}</p>
        <p>需要 {{ selectedItem?.cost }} 积分</p>
      </van-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { shopApi } from '../api/services'

const router = useRouter()
const userStore = useUserStore()
const items = ref<any[]>([])
const selectedItem = ref<any>(null)
const showDialog = ref(false)

onMounted(async () => {
  try { const res = await shopApi.getItems(); items.value = res.data.data }
  catch (err) { console.error('加载商品失败', err) }
})

function showItemDetail(item: any) { selectedItem.value = item; showDialog.value = true }

async function redeemItem() {
  if (!selectedItem.value) return
  try {
    await shopApi.redeem(selectedItem.value.id, 1)
    showDialog.value = false
    const res = await shopApi.getItems(); items.value = res.data.data
  } catch (err: any) { alert(err.response?.data?.message || '兑换失败') }
}
</script>

<style scoped>
.shop-page { min-height: 100vh; background: var(--bg-color); padding-top: 60px; }
.content { padding: 16px; }
.points-balance { background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; font-size: 18px; font-weight: bold; color: var(--primary-color); }
.shop-item { text-align: center; padding: 16px; }
.item-icon { font-size: 48px; margin-bottom: 8px; }
.item-name { font-size: 14px; margin-bottom: 4px; }
.item-cost { font-size: 12px; color: var(--warning-color); }
</style>
