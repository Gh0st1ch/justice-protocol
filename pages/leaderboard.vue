<template>
  <div class="min-h-screen bg-background">
    <!-- Хедер -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L20 10L28 12L22 18L24 26L16 22L8 26L10 18L4 12L12 10L16 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h1 class="text-2xl font-bold">Justice Protocol</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <Button 
            variant="outline" 
            @click="$router.push('/')"
            class="flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Home
          </Button>
          <Button 
            variant="outline" 
            @click="$router.push('/profile')"
            class="flex items-center gap-2"
          >
            Profile
          </Button>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-2">Judges Leaderboard</h2>
          <p class="text-muted-foreground">Top 10 most active and accurate judges</p>
        </div>

        <!-- Таблица рейтинга -->
        <Card>
          <CardHeader>
            <CardTitle>Top Judges</CardTitle>
            <CardDescription>
              Ranked by reputation score and cases judged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-3 px-4 font-medium">Rank</th>
                    <th class="text-left py-3 px-4 font-medium">Judge</th>
                    <th class="text-left py-3 px-4 font-medium">Reputation</th>
                    <th class="text-left py-3 px-4 font-medium">Cases</th>
                    <th class="text-left py-3 px-4 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(judge, index) in leaderboard" 
                    :key="judge.address"
                    class="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td class="py-3 px-4">
                      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {{ index + 1 }}
                      </div>
                    </td>
                    <td class="py-3 px-4 font-mono text-sm">
                      {{ shortenAddress(judge.address) }}
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <span class="font-bold">{{ judge.reputation }}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-yellow-500">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      {{ judge.casesJudged }} cases
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <span class="font-bold">{{ judge.accuracy }}%</span>
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-green-500 h-2 rounded-full" 
                            :style="{ width: judge.accuracy + '%' }"
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <!-- Статистика -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Total Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">247</div>
              <p class="text-sm text-muted-foreground mt-1">Active community judges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Average Reputation</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">7.2</div>
              <p class="text-sm text-muted-foreground mt-1">Across all judges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">1,842</div>
              <p class="text-sm text-muted-foreground mt-1">Cases resolved</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useJusticeContract } from '~/composables/useContract'

interface Judge {
  address: string
  reputation: number
  casesJudged: number
  accuracy: number
}

const { leaderboardData } = useJusticeContract()
const leaderboard = leaderboardData

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
</script>

<style>
.bg-background {
  background-color: hsl(var(--background));
}
.text-foreground {
  color: hsl(var(--foreground));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.border {
  border-color: hsl(var(--border));
}
.bg-muted {
  background-color: hsl(var(--muted));
}
</style>