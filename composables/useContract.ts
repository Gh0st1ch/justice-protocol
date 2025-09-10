// composables/useContract.ts
import { ref, computed } from 'vue'

export const useJusticeContract = () => {
    // Моковые данные активных кейсов
    const activeCases = ref([
        {
            id: 1,
            title: 'Spam Violation Case',
            defendant: '0x742d35Cc6634C893292',
            description: 'The defendant is accused of sending mass unsolicited messages to multiple users over a period of 3 days, violating community guidelines. Multiple users have reported receiving identical promotional messages.',
            status: 'open',
            evidence: 'Message logs showing 247 identical messages sent to different addresses within 72 hours.'
        },
        {
            id: 2,
            title: 'Fraud Investigation',
            defendant: '0x892aC1234567890abc',
            description: 'Multiple reports of suspicious transaction patterns and potential scam activity. Requires thorough review of transaction history and user reports.',
            status: 'open',
            evidence: 'Transaction history shows pattern of small test transactions followed by large withdrawals from multiple victims.'
        },
        {
            id: 3,
            title: 'Content Policy Breach',
            defendant: '0x543ab98def7654321',
            description: 'User reported for posting inappropriate content and harassment. Evidence includes message logs and user reports from affected community members.',
            status: 'closed',
            evidence: 'Chat logs containing offensive language and personal attacks against 5 different users.'
        }
    ])

    // Функция голосования
    const vote = async (caseId: number, guilty: boolean) => {
        console.log(`Voting ${guilty ? 'GUILTY' : 'NOT GUILTY'} on case ${caseId}`)

        // Обновляем статус кейса
        const caseItem = activeCases.value.find(c => c.id === caseId)
        if (caseItem) {
            caseItem.status = 'closed'

            // Показываем уведомление
            alert(`Successfully voted ${guilty ? 'GUILTY' : 'NOT GUILTY'} on case ${caseId}`)

            return { success: true, message: 'Vote recorded successfully' }
        }

        return { success: false, message: 'Case not found' }
    }

    // Моковые данные для профиля
    const getUserProfile = computed(() => ({
        reputation: 8.5,
        casesJudged: 12,
        balance: '1,250 JCT',
        role: 'Judge',
        accuracy: '87%',
        joinedDate: '2024-01-01'
    }))

    // Моковые данные для лидерборда
    const leaderboardData = ref([
        { address: '0x742d35Cc6634C893292', reputation: 9.8, casesJudged: 45, accuracy: 94 },
        { address: '0x892aC1234567890abc', reputation: 9.5, casesJudged: 38, accuracy: 92 },
        { address: '0x543ab98def7654321', reputation: 9.2, casesJudged: 42, accuracy: 89 },
        { address: '0x678def0123456789', reputation: 8.9, casesJudged: 35, accuracy: 87 },
        { address: '0x321fedcba9876543', reputation: 8.7, casesJudged: 31, accuracy: 85 }
    ])

    // Моковые данные истории голосований
    const votingHistory = ref([
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
        }
    ])

    return {
        activeCases,
        vote,
        getUserProfile,
        leaderboardData,
        votingHistory
    }
}