import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ShoppingItem, Unit } from './types';
import { PREDEFINED_CATEGORIES } from './constants';
import Header from './components/Header';
import FeedbackToast from './components/FeedbackToast';
import ItemCard from './components/ItemCard';
import ShoppingListItem from './components/ShoppingListItem';
import SummaryItem from './components/SummaryItem';
import ConfirmationModal from './components/ConfirmationModal';

// SpeechRecognition types might not be in standard lib
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<number>(1);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [customItemName, setCustomItemName] = useState('');
    const [customItemUnit, setCustomItemUnit] = useState<Unit>('unidade');
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceNotSupported, setVoiceNotSupported] = useState(false);
    
    const recognitionRef = useRef<any>(null);

    const categoryColors: { [key: string]: { bg: string, border: string, text: string } } = {
        '🍚 Alimentos básicos': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
        '🍖 Carnes e proteínas': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
        '🥬 Hortifruti': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
        '🧼 Produtos de limpeza': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
        '🧴 Higiene pessoal': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
        '🛒 Outros': { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-800' }
    };

    const itemToCategoryMap = useMemo(() => {
        const map = new Map<string, string>();
        PREDEFINED_CATEGORIES.forEach(category => {
            category.items.forEach(item => {
                map.set(item.name, category.categoryName);
            });
        });
        return map;
    }, []);

    const allPredefinedItems = useMemo(() =>
        PREDEFINED_CATEGORIES.flatMap(cat => cat.items)
    , []);

    useEffect(() => {
        const savedList = localStorage.getItem('shoppingList');
        if (savedList) {
            setShoppingList(JSON.parse(savedList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }, [shoppingList]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceNotSupported(true);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                showFeedback("Permissão para microfone negada.");
            } else {
                showFeedback("Erro no reconhecimento de voz.");
            }
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            processVoiceCommand(transcript);
        };
    }, []);


    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    const handleAddItem = useCallback((name: string, unit: Unit, icon?: string) => {
        if (shoppingList.some(item => item.name.toLowerCase() === name.toLowerCase())) {
            showFeedback(`${name} já está na lista.`);
            return false;
        }
        const newItem: ShoppingItem = {
            id: new Date().toISOString(),
            name,
            unit,
            icon,
            quantity: 1,
            price: 0,
            purchased: false,
        };
        setShoppingList(prev => [...prev, newItem]);
        showFeedback(`${name} adicionado à lista!`);
        return true;
    }, [shoppingList]);

    const handleRemoveItemByName = useCallback((name: string) => {
        setShoppingList(prev => prev.filter(item => item.name !== name));
        showFeedback(`${name} removido da lista.`);
    }, []);

    const handleAddCustomItem = () => {
        if (!customItemName.trim()) {
            showFeedback('Por favor, digite o nome do produto.');
            return;
        }
        if(handleAddItem(customItemName.trim(), customItemUnit)) {
            setCustomItemName('');
            setCustomItemUnit('unidade');
        }
    };

    const processVoiceCommand = (transcript: string) => {
        const cleanTranscript = transcript.toLowerCase().replace(/^(adicionar|adicione)\s+/, '');
        const potentialItems = cleanTranscript.split(/\s*,\s*|\s+e\s+/);

        const itemsToAdd: any[] = [];
        
        potentialItems.forEach(potentialItemName => {
            const trimmedName = potentialItemName.trim();
            if (!trimmedName) return;

            const foundItem = allPredefinedItems.find(pItem => pItem.name.toLowerCase() === trimmedName);
            
            if (foundItem && !shoppingList.some(item => item.name.toLowerCase() === foundItem.name.toLowerCase())) {
                itemsToAdd.push(foundItem);
            }
        });

        if (itemsToAdd.length > 0) {
            const newItems: ShoppingItem[] = itemsToAdd.map(item => ({
                id: new Date().toISOString() + item.name,
                name: item.name,
                unit: item.unit as Unit,
                icon: item.icon,
                quantity: 1,
                price: 0,
                purchased: false,
            }));
            setShoppingList(prev => [...prev, ...newItems]);
            const addedNames = itemsToAdd.map(i => i.name).join(', ');
            showFeedback(`${addedNames} adicionado(s) à lista!`);
        } else if (potentialItems.length > 0) {
             showFeedback(`Nenhum item novo encontrado no comando de voz.`);
        }
    };

    const handleVoiceListen = () => {
        if (isListening || !recognitionRef.current) return;
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error("Could not start recognition", error);
            showFeedback("Não foi possível iniciar o reconhecimento de voz.");
        }
    };

    const handleUpdateItem = (id: string, updatedValues: Partial<ShoppingItem>) => {
        setShoppingList(prev =>
            prev.map(item => (item.id === id ? { ...item, ...updatedValues } : item))
        );
    };
    
    const handleDeleteItem = useCallback((id: string) => {
        setShoppingList(prevList => {
            const itemToRemove = prevList.find(item => item.id === id);
            if (itemToRemove) {
                showFeedback(`${itemToRemove.name} removido da lista.`);
            }
            return prevList.filter(item => item.id !== id);
        });
    }, []);

    const handleRestart = () => {
        setIsRestartModalOpen(true);
    };

    const confirmRestartAndCloseModal = () => {
        setShoppingList([]);
        setCurrentScreen(1);
        setIsRestartModalOpen(false);
        showFeedback('Compra reiniciada!');
    };

    const handleFinalize = () => {
        if (shoppingList.length === 0) {
            showFeedback('Adicione itens à lista antes de finalizar.');
            return;
        }
        if (!shoppingList.some(item => item.purchased)) {
            if (!window.confirm('Nenhum item foi marcado como comprado. Deseja finalizar mesmo assim?')) {
                return;
            }
        }
        setCurrentScreen(3);
    };

    const generatePDF = () => {
        const jsPDF = (window as any).jspdf?.jsPDF;
        if (!jsPDF) {
            showFeedback('Erro ao carregar o gerador de PDF.');
            return;
        }
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('pt-BR');
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const footerHeight = 20;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('Resumo da Compra', pageWidth / 2, 20, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Data: ${today}`, pageWidth / 2, 30, { align: 'center' });
        
        let y = 45;
        const purchasedItems = shoppingList.filter(item => item.purchased);
        const pendingItems = shoppingList.filter(item => !item.purchased);
        let totalCost = 0;

        const addPageIfNeeded = (spaceNeeded = 0) => {
            if (y + spaceNeeded > pageHeight - footerHeight) {
                doc.addPage();
                y = 20;
            }
        };

        const addItemsToDoc = (title: string, items: ShoppingItem[], showPrice: boolean) => {
            if (items.length > 0) {
                addPageIfNeeded(20); // Space for section title
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(16);
                doc.text(title, 20, y);
                y += 10;
                doc.setLineWidth(0.5);
                doc.line(20, y - 5, 190, y - 5);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                items.forEach(item => {
                    addPageIfNeeded(8); // Space for one item line
                    const itemTotal = item.price * item.quantity;
                    const itemName = item.name; // Removed icon from PDF for cleaner look
                    const line = showPrice
                        ? `${itemName} (${item.quantity} ${item.unit}) x R$ ${item.price.toFixed(2).replace('.', ',')} = R$ ${itemTotal.toFixed(2).replace('.', ',')}`
                        : `${itemName} (${item.quantity} ${item.unit})`;
                    doc.text(line, 25, y);
                    y += 8;
                    if(showPrice) totalCost += itemTotal;
                });
                y += 5;
            }
        };

        addItemsToDoc('Itens Comprados', purchasedItems, true);
        
        if(purchasedItems.length > 0) {
            addPageIfNeeded(25); // Space for total line
            doc.setLineWidth(0.5);
            doc.line(20, y, 190, y);
            y += 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(`Valor Total: R$ ${totalCost.toFixed(2).replace('.', ',')}`, 190, y, { align: 'right' });
            y += 15;
        }

        addItemsToDoc('Itens Pendentes', pendingItems, false);
        
        // Add footer to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            const footerText = 'Desenvolvido por Professor Rafael Alves';
            const linkText = 'https://www.linkedin.com/in/rafael-a-70086b237/';

            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(150);
            
            doc.text(footerText, pageWidth / 2, pageHeight - 12, { align: 'center' });
            doc.text(linkText, pageWidth / 2, pageHeight - 7, { align: 'center' });
        }


        doc.save(`resumo-compras-${today.replace(/\//g, '-')}.pdf`);
        showFeedback('PDF gerado com sucesso!');
    };


    const renderScreen = () => {
        switch (currentScreen) {
            case 1:
                return (
                    <div className="animate-fade-in">
                        <div className="space-y-8">
                            {PREDEFINED_CATEGORIES.map(category => (
                                <div key={category.categoryName}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">{category.categoryName}</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {category.items.map(item => (
                                            <ItemCard 
                                                key={item.name}
                                                item={item} 
                                                onAddItem={() => handleAddItem(item.name, item.unit as Unit, item.icon)}
                                                onRemoveItem={() => handleRemoveItemByName(item.name)}
                                                isSelected={shoppingList.some(i => i.name === item.name)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-6 bg-white rounded-lg shadow-md mt-12">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Adicionar por Voz</h2>
                            {voiceNotSupported ? (
                                <p className="text-red-500">Seu navegador não suporta reconhecimento de voz.</p>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-gray-600 text-center">Clique no microfone e diga os itens. Ex: "Adicionar arroz, feijão e ovos".</p>
                                    <button 
                                        onClick={handleVoiceListen} 
                                        disabled={isListening}
                                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        aria-label="Adicionar itens por voz"
                                    >
                                        <i className="fas fa-microphone text-3xl"></i>
                                        {isListening && <span className="absolute h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>}
                                    </button>
                                    <p className="text-sm text-gray-500 h-5">
                                        {isListening ? 'Ouvindo...' : 'Clique para falar'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white rounded-lg shadow-md mt-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Não encontrou o que queria? Adicione um item personalizado:</h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    value={customItemName}
                                    onChange={e => setCustomItemName(e.target.value)}
                                    placeholder="Nome do produto"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                                    onKeyPress={e => e.key === 'Enter' && handleAddCustomItem()}
                                />
                                <select value={customItemUnit} onChange={e => setCustomItemUnit(e.target.value as Unit)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
                                    <option value="unidade">Unidade</option>
                                    <option value="kg">Kg</option>
                                    <option value="litro">L</option>
                                    <option value="pacote">Pacote</option>
                                    <option value="caixa">Caixa</option>
                                    <option value="dúzia">Dúzia</option>
                                    <option value="pé">Pé</option>
                                    <option value="frasco">Frasco</option>
                                    <option value="rolo">Rolo</option>
                                </select>
                                <button onClick={handleAddCustomItem} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow active:scale-95">
                                    Inserir
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setCurrentScreen(2)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition shadow-lg text-lg active:scale-95 flex items-center gap-2">
                                Próximo <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                const pendingItemsCount = shoppingList.filter(item => !item.purchased).length;

                const filteredShoppingList = shoppingList.filter(item => {
                    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesPending = !showPendingOnly || (showPendingOnly && !item.purchased);
                    return matchesSearch && matchesPending;
                });
                
                const groupedList = filteredShoppingList.reduce((acc, item) => {
                    const category = itemToCategoryMap.get(item.name) || '🛒 Outros';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(item);
                    return acc;
                }, {} as Record<string, ShoppingItem[]>);

                const orderedCategoryNames = PREDEFINED_CATEGORIES.map(c => c.categoryName);
                const displayedCategories = Object.keys(groupedList).sort((a, b) => {
                    if (a === '🛒 Outros') return 1;
                    if (b === '🛒 Outros') return -1;

                    const indexA = orderedCategoryNames.indexOf(a);
                    const indexB = orderedCategoryNames.indexOf(b);

                    if (indexA === -1 || indexB === -1) {
                         return a.localeCompare(b);
                    }

                    return indexA - indexB;
                });
                
                const totalCost = shoppingList.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                return (
                    <div className="animate-fade-in">
                         {shoppingList.length === 0 ? (
                            <p className="text-center text-gray-500 py-16 text-lg">Sua lista está vazia. Volte para adicionar itens.</p>
                        ) : (
                            <>
                                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        <div className="relative flex-grow w-full">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                                <i className="fas fa-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="Pesquisar item na lista..."
                                                className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-700">
                                                    {pendingItemsCount === 0 ? 'Nenhum item faltando!' : `${pendingItemsCount} ${pendingItemsCount === 1 ? 'item faltando' : 'itens faltando'}`}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setShowPendingOnly(!showPendingOnly)}
                                                className={`py-2 px-4 rounded-lg font-semibold transition flex items-center gap-2 ${showPendingOnly ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                <i className={`fas fa-filter ${showPendingOnly ? 'text-white' : 'text-blue-500'}`}></i>
                                                Filtrar Faltantes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {filteredShoppingList.length > 0 ? (
                                    <div className="space-y-8">
                                        {displayedCategories.map(categoryName => {
                                            const colors = categoryColors[categoryName] || categoryColors['🛒 Outros'];
                                            return (
                                                <div key={categoryName} className={`${colors.bg} p-4 sm:p-6 rounded-xl shadow-sm border ${colors.border}`}>
                                                    <h2 className={`text-xl sm:text-2xl font-bold ${colors.text} mb-4 pb-2 border-b-2 ${colors.border}`}>{categoryName}</h2>
                                                    <div className="space-y-4">
                                                        {groupedList[categoryName].map(item => (
                                                            <ShoppingListItem key={item.id} item={item} onUpdate={handleUpdateItem} onRemove={handleDeleteItem} />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-16 text-lg">
                                        {searchQuery && !showPendingOnly && `Nenhum item encontrado com o nome "${searchQuery}".`}
                                        {searchQuery && showPendingOnly && `Nenhum item pendente encontrado com o nome "${searchQuery}".`}
                                        {!searchQuery && showPendingOnly && `Todos os itens foram comprados!`}
                                    </p>
                                )}
                            </>
                        )}
                        <div className="mt-8">
                            <div className="sm:hidden text-center mb-6">
                                <span className="text-base font-medium text-gray-600">Total Previsto</span>
                                <p className="text-3xl font-bold text-green-600">
                                    R$ {totalCost.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <button onClick={() => setCurrentScreen(1)} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition shadow active:scale-95 flex items-center gap-2">
                                    <i className="fas fa-arrow-left"></i> Voltar
                                </button>
                                <div className="text-center hidden sm:block">
                                    <span className="text-base font-medium text-gray-600">Total Previsto</span>
                                    <p className="text-2xl font-bold text-green-600">
                                        R$ {totalCost.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <button onClick={handleFinalize} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition shadow-lg text-lg active:scale-95 flex items-center gap-2">
                                    Finalizar Compra <i className="fas fa-check-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                const purchasedItems = shoppingList.filter(item => item.purchased);
                const totalCostSummary = purchasedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                return (
                    <div className="animate-fade-in bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center">Resumo da Compra</h2>
                        {purchasedItems.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">Nenhum item foi marcado como comprado.</p>
                        ) : (
                            <div className="space-y-3 mb-6">
                                {purchasedItems.map(item => <SummaryItem key={item.id} item={item} />)}
                            </div>
                        )}
                        <div className="border-t-2 border-dashed pt-6 mt-6 flex justify-between items-center">
                            <span className="text-xl sm:text-2xl font-bold text-gray-700">TOTAL:</span>
                            <span className="text-2xl sm:text-3xl font-extrabold text-green-600">
                                R$ {totalCostSummary.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button onClick={generatePDF} className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow active:scale-95 flex items-center justify-center gap-2">
                                <i className="fas fa-file-pdf"></i> Gerar PDF
                            </button>
                            <button onClick={() => setCurrentScreen(2)} className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition shadow active:scale-95 flex items-center justify-center gap-2">
                                <i className="fas fa-edit"></i> Editar Lista
                            </button>
                            <button onClick={handleRestart} className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition shadow active:scale-95 flex items-center justify-center gap-2">
                                <i className="fas fa-sync-alt"></i> Reiniciar
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <div className="flex-grow">
                <Header />
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
                    {renderScreen()}
                </main>
            </div>
            <footer className="w-full py-6 text-center">
                <p className="text-sm text-gray-500">
                    Desenvolvido por{' '}
                    <a 
                        href="https://www.linkedin.com/in/rafael-a-70086b237/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Rafael Alves
                    </a>
                </p>
            </footer>
            <FeedbackToast message={feedbackMessage} />
            <ConfirmationModal 
                isOpen={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                onConfirm={confirmRestartAndCloseModal}
                title="Confirmar Reinício"
                message="Tem certeza que deseja reiniciar? Todos os dados da sua compra atual serão perdidos."
            />
        </div>
    );
};

export default App;