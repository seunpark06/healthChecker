package PT_BO.healthChecker.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class SimpleRagService {

    private final ChatClient chatClient;

    private String context = "";

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("docs/healthchecker-bmi-guide.pdf");
            try (InputStream is = resource.getInputStream(); PDDocument pdf = PDDocument.load(is)) {
                context = new PDFTextStripper().getText(pdf);
            }
        } catch (Exception e) {
            throw new RuntimeException("PDF 로드 실패", e);
        }
    }

    public String ask(String question) {
        String prompt = """
                다음은 건강 관련 가이드입니다.
                -------------------------
                %s
                -------------------------
                위 내용을 참고하여 다음 질문에 답하세요:
                %s
                """.formatted(context, question);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
