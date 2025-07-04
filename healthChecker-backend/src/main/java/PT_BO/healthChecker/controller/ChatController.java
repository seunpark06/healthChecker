package PT_BO.healthChecker.controller;

import PT_BO.healthChecker.dto.ChatRequest;
import PT_BO.healthChecker.dto.ChatResponse;
import PT_BO.healthChecker.service.SimpleRagService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatController {

    private final SimpleRagService simpleRagService;

    @PostMapping("/advice")
    public ChatResponse generate(@RequestBody ChatRequest request) {
        String result = simpleRagService.ask(request.getMessage()); // ← 이게 핵심
        return new ChatResponse(result != null ? result : "응답이 없습니다.");
    }
}
