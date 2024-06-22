import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import API, { endpoints } from '../configs/API';
import moment from 'moment';
import qs from 'qs';

const TagModal = ({ visible, tags, selectedTags, onTagPress, onClose }) => {
    const renderTag = ({ item }) => {
        const isSelected = selectedTags.includes(item.value);
        return (
            <TouchableOpacity
                style={[styles.tagItem, isSelected && styles.tagItemSelected]}
                onPress={() => onTagPress(item.value)}
            >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Chọn tags</Text>
                    <FlatList
                        data={tags}
                        renderItem={renderTag}
                        keyExtractor={(item) => item.value.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.gridView}
                    />
                    <Button title="Đóng" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const SearchJourney = ({ onSearchResults }) => {
    const [searchType, setSearchType] = useState('journey');
    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openSearchType, setOpenSearchType] = useState(false);
    const [openTags, setOpenTags] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currentPicker, setCurrentPicker] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const showDatePicker = (pickerType) => {
        setCurrentPicker(pickerType);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        if (currentPicker === 'start') {
            setStartDate(moment(date).format('YYYY-MM-DD'));
        } else {
            setEndDate(moment(date).format('YYYY-MM-DD'));
        }
        hideDatePicker();
    };

    useEffect(() => {
        const loadTags = async () => {
            try {
                let res = await API.get(endpoints['tags']);
                const tagsData = res.data.map(tag => ({ label: tag.name, value: tag.id }));

                // Lọc các tag trùng lặp
                const uniqueTags = tagsData.filter((tag, index, self) =>
                    index === self.findIndex((t) => t.value === tag.value)
                );

                setTags(uniqueTags);
            } catch (ex) {
                console.error('Error fetching tags:', ex);
            }
        };
        loadTags();
    }, []);

    const handleTagPress = (tag) => {
        setSelectedTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tag)) {
                return prevSelectedTags.filter(t => t !== tag);
            } else {
                return [...prevSelectedTags, tag];
            }
        });
    };

    const fetchSearchResults = async (page = 1) => {
        setLoading(true);
        try {
            let params = {
                page,
                keyword: searchType === 'journey' ? searchText : undefined,
                username: searchType === 'username' ? searchText : undefined,
                place_name: searchType === 'place' ? searchText : undefined,
                tags: selectedTags,
                start_date: startDate,
                end_date: endDate,
            };

            let res = await API.get(endpoints['search'], {
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                }
            });

            const results = page === 1 ? res.data.results : [...results, ...res.data.results];
            onSearchResults(results, res.data.count);
            setTotalPages(Math.ceil(res.data.count / 6));
        } catch (ex) {
            console.error('Error fetching search results:', ex);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchSearchResults(1);
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchSearchResults(nextPage);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <DropDownPicker
                open={openSearchType}
                value={searchType}
                items={[
                    { label: 'Hành trình', value: 'journey' },
                    { label: 'Username', value: 'username' },
                    { label: 'Địa điểm', value: 'place' },
                ]}
                setOpen={setOpenSearchType}
                setValue={setSearchType}
                containerStyle={[styles.dropdown, { zIndex: openSearchType ? 1000 : 1 }]}
                dropDownContainerStyle={[styles.dropDownContainer, { zIndex: 1000 }]}
                style={styles.dropDownPicker}
                listItemLabelStyle={styles.dropDownPickerText}
                placeholder="Chọn loại tìm kiếm"
                onOpen={() => setOpenTags(false)}
            />
            <SearchBar
                placeholder={`Tìm kiếm theo ${searchType === 'journey' ? 'hành trình' : searchType === 'username' ? 'username' : 'địa điểm'}`}
                onChangeText={setSearchText}
                value={searchText}
                platform="default"
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchBarInput}
                inputStyle={styles.searchBarInputText}
                placeholderTextColor="#888"
                onFocus={() => setOpenSearchType(false)}
            />
            <>
                <Text style={styles.label}>Chọn loại hành trình mong muốn</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
                    <Text style={styles.dropdownText}>Chọn tag</Text>
                </TouchableOpacity>
                <View style={styles.selectedTagsContainer}>
                    {selectedTags.map(tag => (
                        <TouchableOpacity key={tag} style={styles.tagItemSelected} onPress={() => handleTagPress(tag)}>
                            <Text style={styles.tagTextSelected}>{tags.find(t => t.value === tag).label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TagModal
                    visible={isModalVisible}
                    tags={tags}
                    selectedTags={selectedTags}
                    onTagPress={handleTagPress}
                    onClose={() => setModalVisible(false)}
                />
                <Text style={styles.label}>Phạm vi ngày</Text>
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.datePickerButton}>
                        <Text style={styles.datePickerText}>{startDate ? startDate : "Chọn ngày bắt đầu"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.datePickerButton}>
                        <Text style={styles.datePickerText}>{endDate ? endDate : "Chọn ngày kết thúc"}</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </>
            <Button title="Search" onPress={handleSearch} color="#FF6347" />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f7f7f7',
    },
    searchBarContainer: {
        marginBottom: 12,
        padding: 0,
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    searchBarInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    searchBarInputText: {
        color: '#000',
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    dropdown: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
    },
    dropdownText: {
        color: '#333',
    },
    dropDownContainer: {
        backgroundColor: '#fff',
    },
    dropDownPicker: {
        backgroundColor: '#fff',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePickerButton: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    datePickerText: {
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    gridView: {
        alignItems: 'center',
    },
    tagItem: {
        padding: 10,
        margin: 5,
        borderRadius: 20,
        backgroundColor: '#ddd',
    },
    tagText: {
        color: '#333',
    },
    tagItemSelected: {
        padding: 10,
        margin: 5,
        borderRadius: 20,
        backgroundColor: '#FF6347',
    },
    tagTextSelected: {
        color: '#fff',
    },
    selectedTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
});

export default SearchJourney;
