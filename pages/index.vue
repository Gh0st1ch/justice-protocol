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
        
        <Button 
          v-if="!isConnected" 
          @click="connectWallet"
          class="bg-primary hover:bg-primary/90"
        >
          Connect Wallet
        </Button>
        
        <div v-else class="flex items-center gap-4">

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

          <Button 
          variant="outline" 
          @click="$router.push('/profile')"
          class="flex items-center gap-2"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Profile
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
      <div v-if="isConnected">
        <!-- Статистика пользователя -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p class="text-sm text-muted-foreground mt-1">Total cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg">Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" class="text-sm">
                {{ isJudge ? 'Judge' : 'User' }}
              </Badge>
              <p class="text-sm text-muted-foreground mt-2">
                {{ isJudge ? 'You can vote on cases' : 'Basic access' }}
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Детали выбранного кейса -->
        <div v-if="selectedCase" class="mb-8">
          <Card>
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle class="text-2xl">{{ selectedCase.title }}</CardTitle>
                  <CardDescription>
                    Case details and voting
                  </CardDescription>
                </div>
                <Badge :variant="selectedCase.status === 'open' ? 'default' : 'secondary'">
                  {{ selectedCase.status.toUpperCase() }}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent class="space-y-6">
              <!-- Информация о кейсе -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-sm mb-2">Defendant</h4>
                  <p class="text-sm font-mono bg-muted p-2 rounded">{{ selectedCase.defendant }}</p>
                </div>
                <div>
                  <h4 class="font-medium text-sm mb-2">Status</h4>
                  <Badge :variant="selectedCase.status === 'open' ? 'default' : 'secondary'">
                    {{ selectedCase.status.toUpperCase() }}
                  </Badge>
                </div>
              </div>

              <!-- Описание -->
              <div>
                <h4 class="font-medium text-sm mb-2">Description</h4>
                <p class="text-sm text-muted-foreground bg-muted p-4 rounded">
                  {{ selectedCase.description }}
                </p>
              </div>

              <!-- Доказательства -->
              <div v-if="selectedCase.evidence">
                <h4 class="font-medium text-sm mb-2">Evidence</h4>
                <p class="text-sm text-muted-foreground bg-muted p-4 rounded">
                  {{ selectedCase.evidence }}
                </p>
              </div>

              <!-- Голосование -->
              <div v-if="isJudge && selectedCase.status === 'open'" class="pt-6 border-t">
                <h4 class="font-medium text-lg mb-4">Your Verdict</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    @click="handleVote(selectedCase.id, true)" 
                    class="h-16 text-lg relative overflow-hidden group guilty-btn"
                    :class="[
                      'bg-red-500/10 border border-red-500/20 text-red-600',
                      'hover:bg-red-500/15 hover:border-red-500/40',
                      'transition-all duration-300 ease-in-out'
                    ]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="font-semibold">Guilty</span>
                  </Button>

                  <Button 
                    @click="handleVote(selectedCase.id, false)" 
                    class="h-16 text-lg relative overflow-hidden group not-guilty-btn"
                    :class="[
                      'bg-green-500/10 border border-green-500/20 text-green-600',
                      'hover:bg-green-500/15 hover:border-green-500/40',
                      'transition-all duration-300 ease-in-out'
                    ]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="font-semibold">Not Guilty</span>
                  </Button>
                </div>
              </div>

              <div v-else-if="selectedCase.status === 'closed'" class="pt-6 border-t">
                <Badge variant="outline" class="bg-green-50 text-green-700 text-sm">
                  Case resolved - Thank you for your vote
                </Badge>
              </div>

              <!-- Кнопка назад -->
              <div class="pt-4">
                <Button variant="outline" @click="selectedCase = null">
                  ← Back to Cases
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Список активных кейсов (показывается когда нет выбранного кейса) -->
        <div v-else>
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>Active Cases</CardTitle>
              <CardDescription>
                Current cases requiring judgment. Click to view details and vote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <Card 
                  v-for="caseItem in activeCases" 
                  :key="caseItem.id"
                  class="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  @click="openCase(caseItem)"
                >
                  <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div class="flex-1">
                      <h3 class="font-semibold text-lg mb-2">{{ caseItem.title }}</h3>
                      <p class="text-sm text-muted-foreground mb-3">
                        Defendant: <span class="font-mono">{{ caseItem.defendant }}</span>
                      </p>
                      <p class="text-sm line-clamp-2">{{ caseItem.description }}</p>
                    </div>
                    <Badge 
                      :variant="caseItem.status === 'open' ? 'default' : 'secondary'"
                      class="flex-shrink-0"
                    >
                      {{ caseItem.status.toUpperCase() }}
                    </Badge>
                  </div>
                  
                  <div class="pt-4 border-t">
                    <Button variant="outline" size="sm" @click.stop="openCase(caseItem)">
                      View Details & Vote
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Состояние без подключенного кошелька -->
      <div v-else class="max-w-2xl mx-auto text-center py-16">
        <div class="mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-6 text-primary">
            <path d="M40 10L50 30L70 35L55 45L60 65L40 55L20 65L25 45L10 35L30 30L40 10Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 class="text-3xl font-bold mb-4">Welcome to Justice Protocol</h2>
          <p class="text-lg text-muted-foreground mb-8">
            A decentralized justice system where community members serve as judges
          </p>
        </div>
        
        <Card class="text-left">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Connect your wallet to participate in the justice system
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold">1</span>
              </div>
              <div>
                <p class="font-medium">Connect Wallet</p>
                <p class="text-sm text-muted-foreground">Link your cryptocurrency wallet</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold">2</span>
              </div>
              <div>
                <p class="font-medium">Review Cases</p>
                <p class="text-sm text-muted-foreground">Examine active cases requiring judgment</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold">3</span>
              </div>
              <div>
                <p class="font-medium">Vote</p>
                <p class="text-sm text-muted-foreground">Cast your vote on each case</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button @click="connectWallet" size="lg" class="w-full bg-primary hover:bg-primary/90">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                <path d="M21 12V7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H17M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>

    <!-- Футер -->
    <footer class="border-t mt-16">
      <div class="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Justice Protocol. Decentralized justice system.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from '~/composables/useWallet'
import { useJusticeContract } from '~/composables/useContract'

interface VotingRecord {
  caseId: number
  verdict: string
  date: string
}

interface CaseItem {
  id: number
  title: string
  defendant: string
  description: string
  status: string
  evidence?: string
}

const { address, isConnected, connectWallet, disconnectWallet } = useWallet()
const { activeCases, vote } = useJusticeContract()

const selectedCase = ref<CaseItem | null>(null)

const shortenedAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const votingHistory = ref<VotingRecord[]>([
  { caseId: 102, verdict: 'Guilty', date: '2024-01-15' },
  { caseId: 98, verdict: 'Not Guilty', date: '2024-01-12' },
  { caseId: 95, verdict: 'Guilty', date: '2024-01-10' }
])

const isJudge = computed(() => isConnected.value)

const openCase = (caseItem: CaseItem) => {
  selectedCase.value = caseItem
}

const handleVote = async (caseId: number, guilty: boolean) => {
  const result = await vote(caseId, guilty)
  if (result.success) {
    selectedCase.value = null
  }
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
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
.guilty-btn:hover {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

.not-guilty-btn:hover {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

.guilty-btn, .not-guilty-btn {
  transition: all 0.3s ease-in-out;
}
</style>