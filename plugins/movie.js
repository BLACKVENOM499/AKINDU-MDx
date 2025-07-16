// කෝඩ් හොරුන්ට තමා ENC කරන් නැතුව දැම්මෙ. අරගෙන Use කරපල්ලා 😂😂


const { exec } = require('../lib')
const axios = require('axios')

exec({
    command: 'movie',
    react: '🎬',
    category: 'download'
}, async (darknero, match, me, { text }) => {
    try {
        if (!text) return match.reply('Please provide a movie name to search')
        
        match.reply('🔍 Searching for movies...')
        
        const { data } = await axios.get(`https://sadiya-tech-apis.vercel.app/movie/sinhalasub-search?text=${encodeURIComponent(text)}&apikey=sadiya`)
        
        if (!data.status || !data.result || data.result.length === 0) {
            return match.reply('❌ No movies found for your search query')
        }
        
        global.movieResults = data.result;
        
        let resultMessage = '🎬 *Movie Search Results* 🎬\n\n';
        
        for (let i = 0; i < Math.min(data.result.length, 5); i++) {
            const movie = data.result[i];
            resultMessage += `*${i+1}.* ${movie.title}\n`;
        }
        
        resultMessage += '\n*Reply with the number to download the movie*';
        
        const message = await darknero.sendMessage(match.chat, { text: resultMessage }, { quoted: match });
        const messageId = message.key.id;
        
        darknero.nonSender(messageId, async (receivedMsg, receivedText, senderID) => {
            if (global.movieResults) {
                await darknero.sendMessage(senderID, {
                    react: { text: '⬇️', key: receivedMsg.key }
                });
                
                const choice = parseInt(receivedText);
                
                if (isNaN(choice) || choice < 1 || choice > Math.min(global.movieResults.length, 5)) {
                    return darknero.sendMessage(senderID, { 
                        text: "❌ Invalid option! Please reply with a number between 1 and " + 
                              Math.min(global.movieResults.length, 5)
                    }, { quoted: receivedMsg });
                }
                
                const selectedMovie = global.movieResults[choice - 1];
                
                if (!selectedMovie || !selectedMovie.link) {
                    return darknero.sendMessage(senderID, { 
                        text: "❌ Movie link not available" 
                    }, { quoted: receivedMsg });
                }
                
                await darknero.sendMessage(senderID, { 
                    text: `📥 Getting download links for: ${selectedMovie.title}` 
                }, { quoted: receivedMsg });
                
                try {
                    const downloadData = await axios.get(`https://sadiya-tech-apis.vercel.app/movie/sinhalasub-dl?url=${encodeURIComponent(selectedMovie.link)}&apikey=sadiya`);
                    
                    if (!downloadData.data.status || !downloadData.data.result || !downloadData.data.result.pixeldrain_dl_link) {
                        return darknero.sendMessage(senderID, { 
                            text: "❌ Download links not available for this movie" 
                        }, { quoted: receivedMsg });
                    }
                    
                    const downloadLinks = downloadData.data.result.pixeldrain_dl_link;
                    const movieInfo = downloadData.data.result;
                    
                    const sd480Link = downloadLinks.find(link => link.quality === "SD 480p");
                    
                    if (!sd480Link) {
                        return darknero.sendMessage(senderID, { 
                            text: "❌ 480p quality not available for this movie" 
                        }, { quoted: receivedMsg });
                    }
                    
                    let movieInfoMessage = `🎬 *${movieInfo.title || selectedMovie.title}*\n\n`;
                    if (movieInfo.date) movieInfoMessage += `📅 *Date:* ${movieInfo.date}\n`;
                    if (movieInfo.tmdbRate) movieInfoMessage += `⭐ *TMDB Rate:* ${movieInfo.tmdbRate}/10\n`;
                    if (movieInfo.sinhalasubVote) movieInfoMessage += `🗳️ *SinhalaSub Vote:* ${movieInfo.sinhalasubVote}/10\n`;
                    if (movieInfo.director) movieInfoMessage += `🎭 *Director:* ${movieInfo.director}\n`;
                    if (movieInfo.subtitle_author) movieInfoMessage += `📝 *Subtitle by:* ${movieInfo.subtitle_author}\n`;
                    if (movieInfo.category && movieInfo.category.length > 0) {
                        movieInfoMessage += `🏷️ *Category:* ${movieInfo.category.join(', ')}\n`;
                    }
                    
                    movieInfoMessage += `\n📱 *Quality:* ${sd480Link.quality}\n`;
                    movieInfoMessage += `📦 *Size:* ${sd480Link.size}\n\n`;
                    movieInfoMessage += `⬇️ *Downloading...*`;
                    
                    if (movieInfo.image) {
                        try {
                            await darknero.sendMessage(senderID, { 
                                image: { url: movieInfo.image },
                                caption: movieInfoMessage
                            }, { quoted: receivedMsg });
                        } catch (imgError) {
                            console.log('Error sending image:', imgError);
                            await darknero.sendMessage(senderID, { 
                                text: movieInfoMessage 
                            }, { quoted: receivedMsg });
                        }
                    } else {
                        await darknero.sendMessage(senderID, { 
                            text: movieInfoMessage 
                        }, { quoted: receivedMsg });
                    }
                    
                    await darknero.sendMessage(senderID, { 
                        document: { url: sd480Link.link },
                        fileName: `${movieInfo.title || selectedMovie.title} - 480p.mp4`,
                        mimetype: 'video/mp4'
                    }, { quoted: receivedMsg });
                    
                    delete global.movieResults;
                    
                } catch (downloadError) {
                    console.error('Download error:', downloadError);
                    return darknero.sendMessage(senderID, { 
                        text: "❌ Error occurred while getting download links" 
                    }, { quoted: receivedMsg });
                }
            }
        });
        
    } catch (error) {
        console.error(error)
        match.reply('❌ Error occurred while searching movies')
    }
});

