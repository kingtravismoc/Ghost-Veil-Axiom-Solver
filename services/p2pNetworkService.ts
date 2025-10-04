import type { P2PNode, MacroThreat, LogType, Wallet, DeveloperProfile, Extension, Transaction, TransactionType } from '../types';
import { MASTER_VERSION_HASH } from './validationService';
import { sha256 } from 'js-sha256';

interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
}

class BlockchainService {
    private blockchain: Block[] = [];
    private pendingTransactions: Transaction[] = [];

    constructor() {
        this.createBlock(1, '0'); // Genesis block
    }
    
    private createBlock(nonce: number, previousHash: string): Block {
        const block: Block = {
            index: this.blockchain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            previousHash,
            nonce,
            hash: '' // will be calculated next
        };
        block.hash = this.calculateHash(block);
        
        this.blockchain.push(block);
        this.pendingTransactions = [];
        return block;
    }

    private calculateHash(block: Block): string {
        return sha256(block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce);
    }

    public addTransaction(transaction: Transaction) {
        this.pendingTransactions.push(transaction);
    }

    public createWallet(): Wallet {
        // In a real app, this would involve public/private key generation.
        const privateKey = `priv_key_${sha256(Math.random().toString())}`;
        const address = `VLT_ADDR_${sha256(privateKey).slice(0, 24)}`;
        return { address, privateKey, balance: 1000 }; // Start with some tokens for testing
    }

    public processExtensionSale(
        buyerProfile: DeveloperProfile,
        developerProfile: DeveloperProfile,
        systemConfig: { systemWalletAddress: string | null; superAdminWalletAddress: string | null },
        extension: Extension
    ): { success: boolean; newTransactions: Transaction[] } {

        if (buyerProfile.wallet.balance < extension.price) {
            return { success: false, newTransactions: [] };
        }
        
        const saleAmount = extension.price;
        const systemCut = saleAmount * 0.10;
        const networkCut = saleAmount * 0.30;
        const developerCut = saleAmount * 0.60;
        
        const purchaseTx: Transaction = {
            id: `tx_${Date.now()}_buy`,
            timestamp: Date.now(),
            type: 'PURCHASE',
            amount: saleAmount,
            description: `Purchase of ${extension.name} v${extension.version}`
        };

        const saleTx: Transaction = {
            id: `tx_${Date.now()}_sell`,
            timestamp: Date.now(),
            type: 'SALE',
            amount: developerCut,
            description: `Sale of ${extension.name} v${extension.version}`
        };
        
        const newTransactions: Transaction[] = [purchaseTx, saleTx];

        // Simulate transfers
        buyerProfile.wallet.balance -= saleAmount;
        developerProfile.wallet.balance += developerCut;
        developerProfile.totalSales += saleAmount;
        developerProfile.withdrawableBalance += developerCut;

        buyerProfile.transactions.push(purchaseTx);
        developerProfile.transactions.push(saleTx);

        // In a real system, these would also create transactions to the system and network wallets
        // For now, we'll just log it.
        console.log(`System wallet (${systemConfig.systemWalletAddress}) received ${systemCut} VLT.`);
        console.log(`Network reward pool received ${networkCut} VLT.`);

        return { success: true, newTransactions };
    }

}


const aliases = [
  'ZeroCool', 'AcidBurn', 'CrashOverride', 'CerealKiller', 'LordNikon',
  'PhantomPhreak', 'Magellan', 'HAL', 'Trinity', 'Neo', 'Morpheus',
  'Cable', 'Domino', 'Bishop', 'Ripley', 'Hicks', 'Ghost'
];

const generateRandomNode = (isFork: boolean): P2PNode => {
    const alias = aliases[Math.floor(Math.random() * aliases.length)];
    const id = `node_${Date.now()}_${Math.random()}`;
    const status = Math.random() > 0.1 ? (Math.random() > 0.8 ? 'THREAT_DETECTED' : 'SECURE') : 'OFFLINE';
    return {
        id,
        alias: `${alias}${Math.floor(Math.random()*100)}`,
        status,
        lastSeen: Date.now(),
        ip: `2${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        appHash: isFork ? `fork_hash_${(Math.random() + 1).toString(36).substring(7)}` : MASTER_VERSION_HASH,
    };
};

const registeredFork: P2PNode = {
    id: 'node_fork_jdoe',
    alias: 'JDoe_Fork',
    status: 'ONLINE',
    lastSeen: Date.now(),
    ip: '45.12.5.88',
    appHash: 'fork_hash_def456_doe_edition',
};


class P2PNetworkService {
    private nodes: P2PNode[] = [];
    private _logger: (message: string, type?: LogType) => void = () => {};
    public blockchainService = new BlockchainService();

    constructor() {
        this.nodes = [
            ...Array.from({ length: 10 }, () => generateRandomNode(false)),
            ...Array.from({ length: 3 }, () => generateRandomNode(true)),
            registeredFork
        ];
    }

    public registerLogger(logger: (message: string, type?: LogType) => void) {
        this._logger = logger;
    }

    public getNodes(currentAppHash: string): P2PNode[] {
        return this.nodes.filter(node => node.appHash === currentAppHash);
    }
    
    public start() {
       setInterval(() => {
            this.nodes.forEach(node => {
                if (node.status !== 'OFFLINE' && Math.random() < 0.05) {
                    node.status = 'OFFLINE';
                    this._logger(`Peer ${node.alias} went offline.`, 'NETWORK');
                } else if (node.status === 'OFFLINE' && Math.random() < 0.1) {
                    node.status = 'SECURE';
                    this._logger(`Peer ${node.alias} came online.`, 'NETWORK');
                } else if (node.status === 'SECURE' && Math.random() < 0.15) {
                    node.status = 'THREAT_DETECTED';
                     this._logger(`Peer ${node.alias} is reporting a new threat vector.`, 'NETWORK');
                }
                if (node.status !== 'OFFLINE') {
                    node.lastSeen = Date.now();
                }
            });
        }, 10000);
    }

    public checkNetworkConsensus(nodesOnMyNetwork: P2PNode[]): MacroThreat | null {
        const threatNodes = nodesOnMyNetwork.filter(n => n.status === 'THREAT_DETECTED');
        const onlineNodes = nodesOnMyNetwork.filter(n => n.status !== 'OFFLINE');
        
        if (onlineNodes.length < 3 || threatNodes.length / onlineNodes.length < 0.6) {
            return null;
        }

        return {
            name: "Coordinated Cognitive Influence Campaign",
            objective: "Degrade public trust in decentralized information networks via memetic warfare.",
            scope: "REGIONAL",
            confidence: 0.85 + Math.random() * 0.1
        };
    }
}

export const p2pNetworkService = new P2PNetworkService();