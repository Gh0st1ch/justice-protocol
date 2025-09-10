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
            @click="$router.push('/leaderboard')"
            class="flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3L21 3V21H3V3L8 3M12 12L15 15M12 12L9 15M12 12L12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Leaderboard
          </Button>
          <Badge variant="secondary" class="font-mono">
            {{ shortenedAddress }}
          </Badge>
          <Button variant="outline" @click="disconnectWallet">
            Disconnect
          </Button>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="container mx-auto px-4 py-8">
      <div v-if="isConnected" class="max-w-4xl mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-2">User Profile</h2>
          <p class="text-muted-foreground">Your justice protocol statistics and history</p>
        </div>

        <!-- Основная информация -->
        <Card class="mb-8">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-sm text-muted-foreground mb-2">Wallet Address</h4>
                <p class="font-mono text-sm bg-muted p-3 rounded">{{ address }}</p>
              </div>
              <div>
                <h4 class="font-medium text-sm text-muted-foreground mb-2">Role</h4>
                <Badge variant="default" class="text-sm">
                  {{ userRole }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Статистика -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">1,250 JCT</div>
              <p class="text-sm text-muted-foreground mt-1">Justice Protocol Tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Reputation Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">8.5</div>
              <p class="text-sm text-muted-foreground mt-1">Good standing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Cases Judged</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-3xl font-bold text-primary">12</div>
              <p class="text-sm text-muted-foreground mt-1">Total cases reviewed</p>
            </CardContent>
          </Card>
        </div>

        <!-- Детали выбранного голосования -->
        <div v-if="selectedVote" class="mb-8">
          <Card>
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle class="text-2xl">Case #{{ selectedVote.caseId }} - {{ selectedVote.title }}</CardTitle>
                  <CardDescription>
                    Voting details and statistics
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" @click="selectedVote = null">
                  ← Back to History
                </Button>
              </div>
            </CardHeader>
            
            <CardContent class="space-y-6">
              <!-- Информация о кейсе -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-sm mb-2">Case ID</h4>
                  <p class="text-sm font-mono bg-muted p-2 rounded">#{{ selectedVote.caseId }}</p>
                </div>
                <div>
                  <h4 class="font-medium text-sm mb-2">Date</h4>
                  <p class="text-sm text-muted-foreground">{{ selectedVote.date }}</p>
                </div>
              </div>

              <!-- Описание -->
              <div>
                <h4 class="font-medium text-sm mb-2">Description</h4>
                <p class="text-sm text-muted-foreground bg-muted p-4 rounded">
                  {{ selectedVote.description }}
                </p>
              </div>

              <!-- Статистика голосования -->
              <div>
                <h4 class="font-medium text-lg mb-4">Voting Results</h4>
                <div class="space-y-4">
                  <!-- Прогресс бар Not Guilty -->
                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="text-green-600 font-medium">Not Guilty</span>
                      <span class="font-bold">{{ selectedVote.percentages.notGuilty }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        class="bg-green-500 h-3 rounded-full" 
                        :style="{ width: selectedVote.percentages.notGuilty + '%' }"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- Прогресс бар Guilty -->
                  <div>
                    <div class="flex justify-between text-sm mb-2">
                      <span class="text-red-600 font-medium">Guilty</span>
                      <span class="font-bold">{{ selectedVote.percentages.guilty }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        class="bg-red-500 h-3 rounded-full" 
                        :style="{ width: selectedVote.percentages.guilty + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ваш голос -->
              <div class="p-4 rounded-lg border" :class="{
                'bg-green-500/10 text-green-600': selectedVote.verdict === 'Not Guilty',
                'bg-red-500/10 text-red-600': selectedVote.verdict === 'Guilty'
              }">
                <h4 class="font-medium text-lg mb-2">Your Verdict</h4>
                <Badge :variant="selectedVote.verdict === 'Guilty' ? 'destructive' : 'default'" class="text-lg px-4 py-2">
                  {{ selectedVote.verdict }}
                </Badge>
                <p class="text-sm text-muted-foreground mt-2">
                  Thank you for participating in this case
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- История голосований (показывается когда нет выбранного голосования) -->
        <div v-else>
          <Card>
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
              <CardDescription>
                Your complete voting activity history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div 
                  v-for="(vote, index) in votingHistory" 
                  :key="index" 
                  class="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  @click="selectedVote = vote"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="font-medium">Case #{{ vote.caseId }} - {{ vote.title }}</p>
                      <p class="text-sm text-muted-foreground mt-1">{{ vote.description }}</p>
                      <p class="text-xs text-muted-foreground mt-2">{{ vote.date }}</p>
                      
                      <!-- Проценты голосов -->
                      <div class="flex items-center gap-4 mt-3">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span class="text-xs text-muted-foreground">Not Guilty: {{ vote.percentages.notGuilty }}%</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span class="text-xs text-muted-foreground">Guilty: {{ vote.percentages.guilty }}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex flex-col items-end gap-2">
                      <Badge :variant="vote.verdict === 'Guilty' ? 'destructive' : 'default'">
                        {{ vote.verdict }}
                      </Badge>
                      <Button variant="ghost" size="sm" @click.stop="selectedVote = vote">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div v-if="votingHistory.length === 0" class="text-center py-8">
                  <p class="text-muted-foreground">No voting history yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div v-else class="max-w-2xl mx-auto text-center py-16">
        <Card>
          <CardHeader>
            <CardTitle>Profile Access</CardTitle>
            <CardDescription>
              Connect your wallet to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button @click="connectWallet" size="lg" class="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from '~/composables/useWallet'

import { useJusticeContract } from '~/composables/useContract'
const { getUserProfile } = useJusticeContract()
const userProfile = getUserProfile

interface VotingRecord {
  caseId: number
  title: string
  description: string
  verdict: string
  date: string
  percentages: {
    guilty: number
    notGuilty: number
  }
}

const { address, isConnected, connectWallet, disconnectWallet } = useWallet()

const selectedVote = ref<VotingRecord | null>(null)

const shortenedAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const userRole = computed(() => isConnected.value ? 'Judge' : 'User')

const votingHistory = ref<VotingRecord[]>([
  { 
    caseId: 102, 
    title: 'Spam Violation',
    description: 'Mass unsolicited messages sent to multiple users over 3 days',
    verdict: 'Guilty', 
    date: '2024-01-15',
    percentages: { guilty: 85, notGuilty: 15 }
  },
  { 
    caseId: 98, 
    title: 'Fraud Investigation',
    description: 'Suspicious transaction patterns and potential scam activity',
    verdict: 'Not Guilty', 
    date: '2024-01-12',
    percentages: { guilty: 30, notGuilty: 70 }
  },
  { 
    caseId: 95, 
    title: 'Content Policy Breach',
    description: 'Inappropriate content and harassment against community members',
    verdict: 'Guilty', 
    date: '2024-01-10',
    percentages: { guilty: 92, notGuilty: 8 }
  }
])
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
.glow-red {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}
.glow-green {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
}
.group:hover .glow-red {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
}
.group:hover .glow-green {
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.5);
}
</style>